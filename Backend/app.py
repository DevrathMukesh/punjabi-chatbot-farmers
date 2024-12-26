from flask import Flask, request, jsonify
from utils.langdetect_utils import detect_language
from utils.translator import english_to_punjabi, punjabi_to_english
from utils.text_to_speech import text_to_speech
from models.vector_db import create_vector_database
from models.chat_chain import rag_chain
import speech_recognition as sr
from googletrans import Translator
from werkzeug.utils import secure_filename
from langchain_community.embeddings import HuggingFaceEmbeddings
from flask_cors import CORS
import os
import logging
#Import vector store functions
from vector_store import update_vector_store_with_pdfs


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Folder Configurations
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'audio_files')
app.config['RECORDED_AUDIO_FOLDER'] = os.path.join(app.root_path, 'recorded_audio')
app.config['RECORDED_PDF_FOLDER'] = os.path.join(app.root_path, 'pdf_files')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RECORDED_AUDIO_FOLDER'], exist_ok=True)
os.makedirs(app.config['RECORDED_PDF_FOLDER'], exist_ok=True)

# Initialize HuggingFace Embeddings and Vector Database
print("Initializing HuggingFace Embeddings...")
huggingface_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
print("Creating Vector Database...")
create_vector_database(huggingface_embeddings, "db/extended_chroma_db_with_metadata")
print("Vector Database initialized successfully!")

# Initialize Recognizer and Translator
recognizer = sr.Recognizer()
translator = Translator()
print("Recognizer and Translator initialized.")

def process_speech_to_text(audio_file_path, lang="en-IN"):
    """Process Speech-to-Text and Translation"""
    try:
        print(f"[Speech-to-Text] Processing file: {audio_file_path} with language: {lang}")
        with sr.AudioFile(audio_file_path) as source:
            audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data, language=lang)
        
        print(f"[Speech-to-Text] Recognized text: {text}")
        
        if lang == 'pa-IN':
            translated_text = translator.translate(text, dest='pa').text
            print(f"[Translation] Punjabi to English: {translated_text}")
            return translated_text
        
        return text
    except sr.UnknownValueError:
        print("[Speech-to-Text] Could not understand audio.")
        return {"error": "Could not understand the audio."}
    except sr.RequestError as e:
        print(f"[Speech-to-Text] Service error: {e}")
        return {"error": f"Speech Recognition service error: {e}"}
    except Exception as e:
        print(f"[Speech-to-Text] Unexpected error: {e}")
        return {"error": f"Error: {e}"}

@app.route('/speech-to-text', methods=['POST'])
def handle_speech_to_text():
    try:
        print("[/speech-to-text] Request received.")
        
        if 'audio' not in request.files:
            print("[/speech-to-text] No audio file in request.")
            return jsonify({"error": "No audio file provided"}), 400
        
        # Get the language toggle from the request (default to 'en-IN')
        lang = request.form.get('language', 'en-IN')
        print(f"[/speech-to-text] Language selected: {lang}")
        
        # Save the audio file
        audio_file = request.files['audio']
        filename = secure_filename(audio_file.filename)
        file_path = os.path.join(app.config['RECORDED_AUDIO_FOLDER'], filename)
        audio_file.save(file_path)
        print(f"[/speech-to-text] Audio file saved at: {file_path}")
        
        # Process speech-to-text with the specified language
        text = process_speech_to_text(file_path, lang=lang)
        print(f"[/speech-to-text] Recognized text: {text}")
        
        return jsonify({"recognized_text": text}), 200
    
    except Exception as e:
        print(f"[/speech-to-text] Error: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/upload', methods=['POST'])
def upload_document():
    try:
        if 'document' not in request.files:
            return jsonify({"error": "No document file provided"}), 400
        
        document_file = request.files['document']
        filename = secure_filename(document_file.filename)
        file_path = os.path.join(app.config['RECORDED_PDF_FOLDER'], filename)
        document_file.save(file_path)

        # Update the vector store with the uploaded PDF
        update_vector_store_with_pdfs(file_path)

        return jsonify({"message": "Document uploaded and vector store updated successfully!"}), 200
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/chat', methods=['POST'])
def chat():
    try:
        print("[/chat] Request received.")
        data = request.get_json()
        query = data.get('query', '')
        chat_history = data.get('chat_history', [])
        
        if not query:
            print("[/chat] No query provided.")
            return jsonify({"error": "No query provided"}), 400
        
        print(f"[/chat] Original query: {query}")
        language = detect_language(query)
        print(f"[/chat] Detected language: {language}")
        
        if language.lower() == "pa":
            query = punjabi_to_english(query)
            print(f"[/chat] Translated query to English: {query}")
        
        result = rag_chain.invoke({"input": query, "chat_history": chat_history})
        response = result['answer']
        print(f"[/chat] RAG Response: {response}")
        
        if language.lower() == "pa":
            response = english_to_punjabi(response)
            print(f"[/chat] Translated response to Punjabi: {response}")
        
        audio_file = text_to_speech(response)
        print(f"[/chat] TTS Audio File: {audio_file}")
        
        chat_history.extend([
            {"role": "user", "message": query},
            {"role": "assistant", "message": response}
        ])
        
        print(f"[/chat] Updated Chat History: {chat_history}")
        return jsonify({
            'answer': response,
            'chat_history': chat_history,
            'audio_url': f'/static/audio_files/{audio_file}'
        })
    except Exception as e:
        print(f"[/chat] Error: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)







# from flask import Flask, request, jsonify
# from utils.langdetect_utils import detect_language
# from utils.translator import english_to_punjabi, punjabi_to_english
# from utils.text_to_speech import text_to_speech
# from models.vector_db import create_vector_database
# from models.chat_chain import rag_chain
# import speech_recognition as sr
# from googletrans import Translator
# from werkzeug.utils import secure_filename
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from flask_cors import CORS
# # from vector_store import update_vector_store_with_pdfs  # Updated import
# import os
# import logging

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Folder Configurations
# app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'audio_files')
# app.config['RECORDED_AUDIO_FOLDER'] = os.path.join(app.root_path, 'recorded_audio')
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# os.makedirs(app.config['RECORDED_AUDIO_FOLDER'], exist_ok=True)

# # Load Embeddings and Vector Database
# print("Initializing HuggingFace Embeddings...")
# huggingface_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
# print("Creating Vector Database...")
# create_vector_database(huggingface_embeddings, "db/extended_chroma_db_with_metadata")
# print("Vector Database initialized successfully!")



# # Initialize Recognizer and Translator
# recognizer = sr.Recognizer()
# translator = Translator()
# print("Recognizer and Translator initialized.")


# def process_speech_to_text(audio_file_path, lang="en-IN"):
#     """Process Speech-to-Text and Translation"""
#     try:
#         print(f"[Speech-to-Text] Processing file: {audio_file_path} with language: {lang}")
#         with sr.AudioFile(audio_file_path) as source:
#             audio_data = recognizer.record(source)
#         text = recognizer.recognize_google(audio_data, language=lang)
        
#         print(f"[Speech-to-Text] Recognized text: {text}")
        
#         if lang == 'pa-IN':
#             translated_text = translator.translate(text, dest='pa').text
#             print(f"[Translation] Punjabi to English: {translated_text}")
#             return translated_text
        
#         return text
#     except sr.UnknownValueError:
#         print("[Speech-to-Text] Could not understand audio.")
#         return {"error": "Could not understand the audio."}
#     except sr.RequestError as e:
#         print(f"[Speech-to-Text] Service error: {e}")
#         return {"error": f"Speech Recognition service error: {e}"}
#     except Exception as e:
#         print(f"[Speech-to-Text] Unexpected error: {e}")
#         return {"error": f"Error: {e}"}


# @app.route('/speech-to-text', methods=['POST'])
# def handle_speech_to_text():
#     try:
#         print("[/speech-to-text] Request received.")
        
#         if 'audio' not in request.files:
#             print("[/speech-to-text] No audio file in request.")
#             return jsonify({"error": "No audio file provided"}), 400
        
#         # Get the language toggle from the request (default to 'en-IN')
#         lang = request.form.get('language', 'en-IN')
#         print(f"[/speech-to-text] Language selected: {lang}")
        
#         # Save the audio file
#         audio_file = request.files['audio']
#         filename = secure_filename(audio_file.filename)
#         file_path = os.path.join(app.config['RECORDED_AUDIO_FOLDER'], filename)
#         audio_file.save(file_path)
#         print(f"[/speech-to-text] Audio file saved at: {file_path}")
        
#         # Process speech-to-text with the specified language
#         text = process_speech_to_text(file_path, lang=lang)
#         print(f"[/speech-to-text] Recognized text: {text}")
        
#         return jsonify({"recognized_text": text}), 200
    
#     except Exception as e:
#         print(f"[/speech-to-text] Error: {e}")
#         return jsonify({"error": str(e)}), 400

# @app.route('/upload', methods=['POST'])
# def upload_document():
#     try:
#         if 'document' not in request.files:
#             return jsonify({"error": "No document file provided"}), 400
        
#         document_file = request.files['document']
#         filename = secure_filename(document_file.filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         document_file.save(file_path)
        
#         # Here you can add logic to process the document (e.g., indexing into the vector store, etc.)
        
#         return jsonify({"message": "Document uploaded successfully!"}), 200
#     except Exception as e:
#         logger.error(f"Error uploading document: {e}")
#         return jsonify({"error": str(e)}), 400


# @app.route('/chat', methods=['POST'])
# def chat():
#     try:
#         print("[/chat] Request received.")
#         data = request.get_json()
#         query = data.get('query', '')
#         chat_history = data.get('chat_history', [])
        
#         if not query:
#             print("[/chat] No query provided.")
#             return jsonify({"error": "No query provided"}), 400
        
#         print(f"[/chat] Original query: {query}")
#         language = detect_language(query)
#         print(f"[/chat] Detected language: {language}")
        
#         if language.lower() == "pa":
#             query = punjabi_to_english(query)
#             print(f"[/chat] Translated query to English: {query}")
        
#         result = rag_chain.invoke({"input": query, "chat_history": chat_history})
#         response = result['answer']
#         print(f"[/chat] RAG Response: {response}")
        
#         if language.lower() == "pa":
#             response = english_to_punjabi(response)
#             print(f"[/chat] Translated response to Punjabi: {response}")
        
#         audio_file = text_to_speech(response)
#         print(f"[/chat] TTS Audio File: {audio_file}")
        
#         chat_history.extend([
#             {"role": "user", "message": query},
#             {"role": "assistant", "message": response}
#         ])
        
#         print(f"[/chat] Updated Chat History: {chat_history}")
#         return jsonify({
#             'answer': response,
#             'chat_history': chat_history,
#             'audio_url': f'/static/audio_files/{audio_file}'
#         })
#     except Exception as e:
#         print(f"[/chat] Error: {e}")
#         return jsonify({"error": str(e)}), 400


# if __name__ == '__main__':
#     print("Starting Flask server on http://localhost:5000")
#     app.run(debug=True, port=5000)

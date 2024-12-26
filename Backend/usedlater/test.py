# from langchain_google_genai import ChatGoogleGenerativeAI
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()
# google_api_key = os.getenv("GOOGLE_API_KEY")

# # Function to check Google Generative AI API key
# def check_google_api_key():
#     try:
#         llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=google_api_key)
#         # Send a basic query to test the API
#         response = llm.invoke("Hello")
#         print("API Key is working! Response:")
#         print(response.content)  # Output the content from the LLM
#     except Exception as e:
#         print("Error: API key is not working.")
#         print(e)

# if __name__ == "__main__":
#     check_google_api_key()
from flask import Flask, request, jsonify
from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")

# Environment setup
DetectorFactory.seed = 0

# Initialize HuggingFace Embeddings and Chroma DB
huggingface_embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persistent_directory = "db/extended_chroma_db_with_metadata"
db = Chroma(persist_directory=persistent_directory, embedding_function=huggingface_embeddings)

# Initialize Conversational Chain
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=google_api_key)
conversational_chain = ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever)

# Flask app setup
app = Flask(__name__)

def process_query(query):
    """
    Process a query and return the response, handles translation and AI model interaction.
    """
    # Detect language
    try:
        language = detect(query)
        print(f"Detected language: {language}")
    except Exception as e:
        return {"response": "Failed to detect language.", "error": str(e)}

    # Translate to English if Punjabi
    original_query = query
    if language.lower() == "pa":
        try:
            query = GoogleTranslator(source='pa', target='en').translate(query)
        except Exception as e:
            return {"response": "Failed to translate query.", "error": str(e)}

    print(f"Translated query: {query} (original: {original_query})")

    # Invoke conversational chain
    try:
        result = conversational_chain.invoke({"question": query, "chat_history": []})
        response = result.get("answer", "I'm sorry, I don't have an answer for that.")
    except Exception as e:
        return {"response": "Failed to generate AI response.", "error": str(e)}

    # Translate response back to Punjabi if necessary
    if language.lower() == "pa":
        try:
            response = GoogleTranslator(source='en', target='pa').translate(response)
        except Exception as e:
            return {"response": "Failed to translate response.", "error": str(e)}

    print(f"Final response: {response}")
    return {"response": response}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"response": "Query is required!"}), 400

    result = process_query(query)
    return jsonify(result)

if __name__ == "__main__":
    # Test the function
    print("Testing the function for a sample query:")
    test_query = "ਕੀ ਪੰਜਾਬ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਦੇ ਨਾਲ-ਨਾਲ ਹੋਰ ਕਿਸੇ ਵੀ ਰਿਤੇ ਜਾਣੇ ਹਨ?"
    print("Test Query:", test_query)
    print("Response:", process_query(test_query))

    # Run Flask app
    app.run(host="0.0.0.0", port=5000)

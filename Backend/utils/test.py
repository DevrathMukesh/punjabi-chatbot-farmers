# import os
# import speech_recognition as sr
# from googletrans import Translator
# import librosa
# import soundfile as sf

# # Initialize recognizer and translator
# recognizer = sr.Recognizer()
# translator = Translator()

# def convert_audio_with_librosa(file_path, target_sample_rate=22050):
#     """Convert audio to mono and resample using librosa"""
#     try:
#         # Try to load the audio file using librosa (auto-converts to mono)
#         audio, sr = librosa.load(file_path, sr=target_sample_rate, mono=True)
#         # Save the processed audio back to a file (WAV format)
#         output_file_path = file_path.replace(".wav", "_converted.wav")
#         sf.write(output_file_path, audio, target_sample_rate)
        
#         print(f"Converted audio saved to: {output_file_path}")
#         return output_file_path
#     except Exception as e:
#         raise Exception(f"Error in audio conversion with librosa: {e}")

# def process_speech_to_text(audio_file_path, lang="en-IN"):
#     """Process Speech-to-Text and Translation"""
#     try:
#         print(f"Processing audio: {audio_file_path}")
        
#         # Convert audio to required configuration (Mono, 22.05 kHz sample rate)
#         # converted_audio_path = convert_audio_with_librosa(audio_file_path)
        
#         # Recognize Speech from converted audio file
#         with sr.AudioFile(audio_file_path) as source:
#             audio_data = recognizer.record(source)
#         text = recognizer.recognize_google(audio_data, language=lang)
        
#         # Translation Logic for Punjabi
#         if lang == 'pa-IN':
#             translated_text = translator.translate(text, dest='en').text
#             final_response = translator.translate(translated_text, dest='pa').text
#             return final_response
        
#         # Return recognized text
#         return text
#     except sr.UnknownValueError:
#         return {"error": "Could not understand the audio."}
#     except sr.RequestError as e:
#         return {"error": f"Speech Recognition service error: {e}"}
#     except Exception as e:
#         return {"error": f"Error: {e}"}

# # Test the function
# if __name__ == "__main__":
#     audio_path = "audio12.m4a"  # Ensure the file exists in the current directory
    
#     if os.path.exists(audio_path):  # Check if the test file exists
#         result = process_speech_to_text(audio_path)
#         print("Result:", result)
#     else:
#         print(f"Audio file {audio_path} does not exist.")

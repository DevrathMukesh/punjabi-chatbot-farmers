from gtts import gTTS
from langdetect import detect
import os
import time

# Function to detect the language and convert text to speech
def text_to_speech(text):
    # Detect the language of the input text
    detected_language = detect(text)

    # Default language is English, switch to Punjabi if detected as Punjabi
    if detected_language == 'pa':
        language = 'pa'  # Punjabi
    else:
        language = 'en'  # Default to English

    # Create a gTTS object with the detected language
    tts = gTTS(text=text, lang=language, slow=False)
    audio_file = f"{int(time.time())}_output.mp3"  # Generate a unique file name

    # Define the path to save the audio inside the 'static/audio_files' directory
    audio_path = os.path.join('static', 'audio_files', audio_file)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)
    
    # Save the audio to a file
    tts.save(audio_path)
    print(f"Audio file saved at: {audio_path}")

    
    return audio_file
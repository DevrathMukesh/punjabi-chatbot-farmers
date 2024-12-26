# import speech_recognition as sr
# from googletrans import Translator

# # Initialize recognizer and translator
# r = sr.Recognizer()
# translator = Translator()

# # Speech-to-Text and Translation Function (Backend only, no recording)
# def speech_to_text(lang="pa-IN", audio_file=None):
#     try:
#         if not audio_file:
#             return {"error": "No audio file provided."}

#         # Load audio from a file (backend processing)
#         with sr.AudioFile(audio_file) as source:
#             audio_data = r.record(source)

#         # Recognize speech in the selected language
#         text = r.recognize_google(audio_data, language=lang)
        
#         # If the language is English (en-IN), return text directly
#         if lang == 'en-IN':
#             return text
        
#         # If the language is Punjabi (pa-IN), translate the recognized text
#         elif lang == 'pa-IN':
#             translated_text = translator.translate(text, dest='en').text  # Translate to English
#             final_response = translator.translate(translated_text, dest='pa').text  # Translate back to Punjabi
#             return final_response

#         # If the language is unsupported, return an error message
#         else:
#             return {"error": "Unsupported language. Please use 'en-IN' or 'pa-IN'."}
    
#     except sr.UnknownValueError:
#         return {"error": "Could not understand the audio."}
#     except sr.RequestError as e:
#         return {"error": f"Speech Recognition service error: {e}"}
#     except Exception as e:
#         return {"error": f"Error: {e}"}


# # Example Usage:
# # From an audio file:
# response = speech_to_text('en-IN', 'audio.wav')
# print(response)

# # From live recording:
# # response = speech_to_text('en-IN')
# # print(response)



# # import speech_recognition as sr
# # from googletrans import Translator
# # import time

# # # Initialize recognizer and translator
# # r = sr.Recognizer()
# # translator = Translator()

# # # Speech-to-Text and Translation Function
# # def speech_to_text_translate(lang, audio_file=None):
# #     try:
# #         if audio_file:
# #             # Load audio from a file
# #             with sr.AudioFile(audio_file) as source:
# #                 audio_data = r.record(source)
# #         else:
# #             # Record audio from microphone
# #             with sr.Microphone() as source:
# #                 print("Recording... Please speak now.")
# #                 r.adjust_for_ambient_noise(source)
# #                 audio_data = r.listen(source)
# #                 print("Recording finished.")
            
# #             # Save the recorded audio as a WAV file
# #             audio_file = f"audio_{int(time.time())}.wav"
# #             with open(audio_file, "wb") as f:
# #                 f.write(audio_data.get_wav_data())

# #         # Recognize speech in the selected language
# #         text = r.recognize_google(audio_data, language=lang)
        
# #         # If the language is English (en-IN), return text directly
# #         if lang == 'en-IN':
# #             return {
# #                 "recognized_text": text,
# #                 "final_response": text
# #             }
# #         # If the language is Punjabi (pa-IN), translate it
# #         elif lang == 'pa-IN':
# #             translated_text = translator.translate(text, dest='en').text
# #             final_response = translator.translate(translated_text, dest='pa').text
            
# #             return {
# #                 "recognized_text": text,
# #                 "translated_text": translated_text,
# #                 "final_response": final_response
# #             }
# #         else:
# #             return {"error": "Unsupported language. Please use 'en-IN' or 'pa-IN'."}
    
# #     except sr.UnknownValueError:
# #         return {"error": "Could not understand the audio"}
# #     except sr.RequestError as e:
# #         return {"error": f"Speech Recognition service error: {e}"}
# #     except Exception as e:
# #         return {"error": f"Error: {e}"}

# # # Example Usage

# # # # From an audio file
# # # response = speech_to_text_translate('en-IN', 'audio.wav')
# # # print(response)

# # # From live recording
# # response = speech_to_text_translate('en-IN')
# # print(response)

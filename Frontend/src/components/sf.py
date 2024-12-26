from gtts import gTTS
import os

text = "ਮੇਰਾ ਨਾਮ ਮੁਕੇਸ਼ ਹੈ।"  # Punjabi text
tts = gTTS(text=text, lang='pa')  # Punjabi language code
tts.save("punjabi_speech.mp3")
os.startfile("punjabi_speech.mp3")  # Open the audio file with Windows Media Player
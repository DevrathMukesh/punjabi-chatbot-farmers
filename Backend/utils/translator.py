from deep_translator import GoogleTranslator

def english_to_punjabi(english_text):
    return GoogleTranslator(source='en', target='pa').translate(english_text)

def punjabi_to_english(punjabi_text):
    return GoogleTranslator(source='pa', target='en').translate(punjabi_text)

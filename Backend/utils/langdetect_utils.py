from langdetect import detect, DetectorFactory

# Ensure consistent results
DetectorFactory.seed = 0

def detect_language(text):
    try:
        # Detect the language of the input text
        language_code = detect(text)
        return language_code
    except Exception as e:
        return str(e)

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()


model=ChatGoogleGenerativeAI(model="gemini-1.5-flash")

result=model.invoke("what is a rubik's cube?")
print("Full result")
print(result)
print("Context")
print(result.content)
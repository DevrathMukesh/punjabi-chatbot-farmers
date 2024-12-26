from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage

load_dotenv()

model=ChatGoogleGenerativeAI(model="gemini-1.5-flash")

messages=[
    SystemMessage("Solve this maths problem"),
    HumanMessage("What is 25 divided by 5?"),
]

result=model.invoke(messages)

print(f"Answer is {result.content}")



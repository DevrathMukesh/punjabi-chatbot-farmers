import os
import pickle
from langdetect import detect, DetectorFactory
from deep_translator import GoogleTranslator
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

google_api_key = os.getenv("GOOGLE_API_KEY")

# Initialize variables and create directories
DetectorFactory.seed = 0
books_dir = "./books"
persistent_directory = "db/extended_chroma_db_with_metadata"

def detect_language(text):
    try:
        language_code = detect(text)
        return language_code
    except Exception as e:
        return str(e)

def english_to_punjabi(english_text):
    return GoogleTranslator(source='en', target='pa').translate(english_text)

def punjabi_to_english(punjabi_text):
    return GoogleTranslator(source='pa', target='en').translate(punjabi_text)

def create_vector_database(embeddings, persistent_directory):
    # Check if the Chroma vector store already exists
    if not os.path.exists(persistent_directory):
        print("Persistent directory does not exist. Initializing vector store...")

        # Ensure the books directory exists
        if not os.path.exists(books_dir):
            raise FileNotFoundError(f"The directory {books_dir} does not exist. Please check the path.")

        # List all text files in the directory
        book_files = [f for f in os.listdir(books_dir) if f.endswith(".txt")]

        # Read the text content from each file and store it with metadata
        documents = []
        for book_file in book_files:
            file_path = os.path.join(books_dir, book_file)
            loader = TextLoader(file_path)
            book_docs = loader.load()
            for doc in book_docs:
                doc.metadata = {"source": book_file}
                documents.append(doc)

        # Split the documents into chunks
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        print("\n--- Document Chunks Information ---")
        print(f"Number of document chunks: {len(docs)}")

        # Create the vector store and persist it
        db = Chroma.from_documents(docs, embeddings, persist_directory=persistent_directory)
        print("\n--- Finished creating and persisting vector store ---")

    else:
        print("Vector store already exists. No need to initialize.")

def continual_chat():
    print("Start chatting with the AI! Type 'exit' to end the conversation.")
    chat_history = []  # Collect chat history here (a sequence of messages)
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            print("Bye....")
            break
        # Detect the language of the input query
        language = detect_language(query)

        if language.lower() == "pa":
            query = punjabi_to_english(str(query))
            print(query)
        else:
            print(query)

        # Process the user's query through the retrieval chain
        result = conversational_chain.invoke({"question": query, "chat_history": chat_history})
        # Display the AI's response
        if language.lower() == "pa":
            punjabi_response = english_to_punjabi(str(result['answer']))
            print(f"AI: {punjabi_response}")
        else:
            print("AI:", result['answer'])

        chat_history.append(HumanMessage(content=query))
        chat_history.append(AIMessage(content=result["answer"]))

if __name__ == "__main__":
    # Load the embedding model
    huggingface_embeddings = pickle.load(open("huggingface_embeddings.pkl", "rb"))
    
    # Initialize vector store and retriever
    db = Chroma(persist_directory=persistent_directory, embedding_function=huggingface_embeddings)
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})
    
    # Initialize the Google model for AI responses
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash",api_key=google_api_key)

    # Initialize the conversational retrieval chain
    conversational_chain = ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=retriever
    )

    continual_chat()

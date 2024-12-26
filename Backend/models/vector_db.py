import os
from langchain_community.document_loaders.text import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Directory containing text files and persistent directory for vector database
books_dir = './cleaned_txt'
db_dir = os.path.join('./', "db")
persistent_directory = os.path.join(db_dir, "extended_chroma_db_with_metadata")

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
                # Add metadata to each document indicating its source
                doc.metadata = {"source": book_file}
                documents.append(doc)

        # Split the documents into chunks
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)

        # Create embeddings and vector store
        db = Chroma.from_documents(docs, embeddings, persist_directory=persistent_directory)
        print("Vector store created and persisted.")
    else:
        print("Vector store already exists.")

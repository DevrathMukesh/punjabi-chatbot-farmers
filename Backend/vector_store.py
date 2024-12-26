# vector_store.py
import os
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Define directories
pdf_dir = './pdf_files'
db_dir = os.path.join('./', "db")
persistent_directory = os.path.join(db_dir, "extended_chroma_db_with_metadata")

# Initialize the embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

def load_existing_vector_store():
    """Loads the existing vector store if available"""
    if os.path.exists(persistent_directory):
        print("Loading existing vector store...")
        db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)
        return db
    else:
        print("Persistent directory does not exist. Initializing vector store...")
        os.makedirs(persistent_directory, exist_ok=True)
        db = Chroma.from_documents([], embeddings, persist_directory=persistent_directory)
        return db

def add_documents_to_vector_store(new_documents):
    """Adds new documents to the existing vector store"""
    db = load_existing_vector_store()

    # Split the documents into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(new_documents)

    if docs:
        db.add_documents(docs)
        db.persist()
        print("New documents added and vector store updated.")
    else:
        print("No documents to add.")

def load_new_documents_from_pdfs(file_path):
    """Load new documents from the provided PDF file path"""
    new_documents = []

    try:
        loader = PyPDFLoader(file_path)
        pdf_docs = loader.load()
        for doc in pdf_docs:
            doc.metadata = {"source": file_path}
            new_documents.append(doc)
    except Exception as e:
        print(f"Failed to process PDF {file_path}: {e}")

    print(f"Loaded {len(new_documents)} documents from PDF file: {file_path}.")
    return new_documents

def update_vector_store_with_pdfs(file_path):
    """Extracts text from the uploaded PDF and updates the vector store"""
    new_documents = load_new_documents_from_pdfs(file_path)
    if new_documents:
        add_documents_to_vector_store(new_documents)
    else:
        print("No new documents to add.")


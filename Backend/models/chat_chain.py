from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from dotenv import load_dotenv
import os
# Load environment variables from the .env file
load_dotenv()

# Access the GOOGLE_API_KEY
google_api_key = os.getenv("GOOGLE_API_KEY")

# Set up embedding and retriever
huggingface_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# Load the vector store and create retriever
persistent_directory = "db/extended_chroma_db_with_metadata"
db = Chroma(persist_directory=persistent_directory, embedding_function=huggingface_embeddings)
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# Initialize the model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Contextualize question prompt
contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, just "
    "reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

# Answer question prompt
qa_system_prompt = (
    "You are an assistant for question-answering tasks. Use "
    "the following pieces of retrieved context to answer the "
    "the question. If you don't know the answer, just say that you "
    "don't know. Use optimal number of sentences to answer the question. "
    "Provide the source as well. "
    "\n\n"
    "{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

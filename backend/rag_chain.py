import os
import asyncio
from typing import List, Optional

from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores.chroma import Chroma
from langchain_community.llms.ollama import Ollama

from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain.schema.runnable import RunnableMap, RunnablePassthrough


class RAGChain:
    def __init__(self, persist_directory: str = "vectorstore"):

        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        self.vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings
        )

        # Try to initialize Ollama, with fallback handling
        self.llm = None
        self.ollama_available = False
        try:
            # Try different models
            models_to_try = ["llama3", "llama2", "mistral", "phi"]
            for model_name in models_to_try:
                try:
                    self.llm = Ollama(model=model_name)
                    # Quick test
                    test_result = str(self.llm.invoke("hi"))
                    if test_result and len(test_result) > 0:
                        self.ollama_available = True
                        print(f"✅ Ollama LLM initialized successfully with model: {model_name}")
                        break
                except:
                    continue
            
            if not self.ollama_available:
                print("⚠️ Ollama not available or no models found")
                print("Using fallback response system")
        except Exception as e:
            print(f"⚠️ Ollama initialization error: {e}")
            print("Using fallback response system")
            self.ollama_available = False

        # RAG prompt for document-based questions
        self.rag_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=(
                "You are a helpful assistant. Use the following context from uploaded documents to answer the question. "
                "If the context contains relevant information, use it to provide a detailed answer. "
                "If the context doesn't contain enough information, you can provide a general answer based on your knowledge.\n\n"
                "Context from documents:\n{context}\n\n"
                "Question: {question}\n\n"
                "Answer:"
            ),
        )

        # Generic prompt for general questions
        self.generic_prompt = PromptTemplate(
            input_variables=["question"],
            template=(
                "You are a helpful AI assistant. Answer the following question in a friendly and informative way.\n\n"
                "Question: {question}\n\n"
                "Answer:"
            ),
        )

        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 4})

        # Convert all items from retriever → Document object
        def normalize(doc):
            if isinstance(doc, Document):
                return doc
            if isinstance(doc, dict):
                return Document(
                    page_content=doc.get("page_content", ""),
                    metadata=doc.get("metadata", {})
                )
            return Document(page_content=str(doc))

        # Build RAG chain for document-based queries (only if LLM is available)
        if self.ollama_available:
            self.rag_chain = (
                RunnableMap({
                    "context": self.retriever | (lambda docs: "\n\n".join(
                        normalize(d).page_content for d in docs
                    )),
                    "question": RunnablePassthrough(),
                })
                | self.rag_prompt
                | self.llm
            )

            # Build generic chain for general questions
            self.generic_chain = (
                self.generic_prompt
                | self.llm
            )
        else:
            self.rag_chain = None
            self.generic_chain = None

    # ---------------------------------------------------
    # ADD DOCUMENTS — Always store Document objects
    # ---------------------------------------------------
    def add_documents(self, texts: List[str], metadata: Optional[List[dict]] = None):

        documents = [
            Document(
                page_content=text,
                metadata=metadata[i] if metadata else {}
            )
            for i, text in enumerate(texts)
        ]

        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()

    # ---------------------------------------------------
    # QUERY - Handles both document-based and generic questions
    # ---------------------------------------------------
    async def query(self, question: str, language: str = "english") -> str:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._query_sync, question, language)

    def _has_documents(self) -> bool:
        """Check if vector store has any documents"""
        try:
            # Try to get a sample document
            results = self.vectorstore.similarity_search("test", k=1)
            return len(results) > 0
        except:
            return False

    def _get_fallback_response(self, question: str) -> str:
        """Fallback response system when LLM is not available"""
        question_lower = question.lower().strip()
        
        # Greetings
        if any(word in question_lower for word in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]):
            return "Hello! 👋 I'm your RAG chatbot assistant. I can help you with questions about uploaded documents or answer general questions. How can I assist you today?"
        
        # How are you
        if "how are you" in question_lower or "how's it going" in question_lower:
            return "I'm doing great, thank you for asking! I'm here and ready to help you with any questions you have. What would you like to know?"
        
        # Weather questions
        if "weather" in question_lower:
            return "I don't have access to real-time weather data, but I'd be happy to help you with other questions! You can ask me about uploaded documents or general knowledge topics."
        
        # What can you do / help
        if any(phrase in question_lower for phrase in ["what can you do", "help", "what do you do", "capabilities"]):
            return "I'm a RAG (Retrieval-Augmented Generation) chatbot! I can:\n• Answer questions about uploaded documents (PDF, PPT, DOCX, images)\n• Have general conversations\n• Help you find information from your documents\n\nUpload some documents and ask me questions about them!"
        
        # Document-related questions
        if any(word in question_lower for word in ["document", "upload", "file", "pdf", "ppt", "docx"]):
            has_docs = self._has_documents()
            if has_docs:
                return "I have access to your uploaded documents! Feel free to ask me specific questions about their content, and I'll search through them to find relevant information."
            else:
                return "I don't have any documents uploaded yet. Please go to the 'Upload Documents' tab and upload some files (PDF, PPT, DOCX, images, etc.), and then I can answer questions about them!"
        
        # Try to find relevant document content for the question
        has_docs = self._has_documents()
        if has_docs:
            try:
                docs = self.retriever.get_relevant_documents(question)
                if docs and len(docs) > 0:
                    # Extract relevant snippets
                    relevant_snippets = []
                    for doc in docs[:3]:  # Top 3 most relevant
                        content = doc.page_content[:300]  # First 300 chars
                        if content.strip():
                            relevant_snippets.append(f"...{content}...")
                    
                    if relevant_snippets:
                        response = "Based on your uploaded documents, I found this relevant information:\n\n"
                        response += "\n\n".join(relevant_snippets)
                        response += "\n\n(Note: For AI-generated summaries and answers, please install Ollama: https://ollama.ai)"
                        return response
            except Exception as e:
                print(f"Document search error: {e}")
        
        # Generic helpful responses
        if "?" in question:
            return f"That's an interesting question! I can help you search through uploaded documents. For AI-powered answers, please install Ollama (https://ollama.ai) and run 'ollama pull llama3'. For now, I can help you find information from your documents!"
        
        # Default friendly response
        return "Thanks for your message! I'm here to help. You can ask me questions about uploaded documents, or general questions. To get AI-powered responses, make sure Ollama is installed and running. For now, I can help you search through uploaded documents!"
    
    def _is_simple_greeting(self, question: str) -> bool:
        """Check if question is a simple greeting that should use fallback"""
        question_lower = question.lower().strip()
        greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", 
                    "how are you", "how's it going", "what's up", "sup", "hi there", "hello there",
                    "what can you do", "help", "what do you do", "capabilities"]
        return any(greeting in question_lower for greeting in greetings)

    def _query_sync(self, question: str, language: str = "english") -> str:
        try:
            # Always use fallback for simple greetings first
            if self._is_simple_greeting(question):
                return self._get_fallback_response(question)
            
            # If LLM is not available, use fallback
            if not self.ollama_available:
                # Check if we have documents for document-based search (only for non-greeting questions)
                has_docs = self._has_documents()
                if has_docs:
                    try:
                        # Try to find relevant document content
                        docs = self.retriever.get_relevant_documents(question)
                        if docs and len(docs) > 0:
                            context = "\n\n".join([doc.page_content[:500] for doc in docs if doc.page_content][:3])
                            if len(context.strip()) > 10:
                                return f"Based on your uploaded documents, here's what I found:\n\n{context[:1000]}...\n\n(Note: For full AI-powered responses, please install and run Ollama)"
                    except Exception as e:
                        print(f"Document search error in fallback: {e}")
                        pass
                
                # Use fallback response system
                return self._get_fallback_response(question)
            
            # LLM is available - use it
            # Check if we have documents in the vector store
            has_docs = self._has_documents()
            
            if has_docs:
                # Try RAG first - retrieve relevant documents
                try:
                    docs = self.retriever.get_relevant_documents(question)
                    
                    if docs and len(docs) > 0:
                        # We have relevant documents, use RAG
                        context = "\n\n".join([doc.page_content for doc in docs if doc.page_content])
                        
                        # Check if context is meaningful (not just empty or very short)
                        if len(context.strip()) > 10:
                            # Use RAG with document context
                            try:
                                result = self.rag_chain.invoke(question)
                                if result and len(result.strip()) > 0 and not result.strip().startswith("Error"):
                                    return result
                            except Exception as chain_error:
                                print(f"RAG chain invoke error: {chain_error}")
                                # Fall through to generic response
                except Exception as rag_error:
                    print(f"RAG retrieval error: {rag_error}")
                    # Fall through to generic response
            
            # Fallback to generic response (no documents or RAG failed)
            try:
                result = self.generic_chain.invoke({"question": question})
                if result and len(result.strip()) > 0:
                    return result
            except Exception as generic_error:
                print(f"Generic LLM error: {generic_error}")
                # Use fallback
                return self._get_fallback_response(question)
            
            # If both fail, return a helpful message
            return self._get_fallback_response(question)
            
        except Exception as e:
            print(f"Query error: {e}")
            import traceback
            traceback.print_exc()
            # Always use fallback response - never return error messages
            try:
                return self._get_fallback_response(question)
            except:
                # Ultimate fallback
                return "Hello! I'm here to help. Please try asking your question again, or upload some documents to get started!"

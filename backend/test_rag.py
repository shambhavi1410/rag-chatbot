"""Quick test script to verify RAG chain works"""
import asyncio
from rag_chain import RAGChain

async def test():
    rag = RAGChain()
    
    test_questions = [
        "hi",
        "hello",
        "how are you",
        "what can you do"
    ]
    
    print("Testing RAG Chain...")
    for question in test_questions:
        try:
            result = await rag.query(question)
            print(f"\nQ: {question}")
            print(f"A: {result[:150]}...")
        except Exception as e:
            print(f"Error with '{question}': {e}")

if __name__ == "__main__":
    asyncio.run(test())


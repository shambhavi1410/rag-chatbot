import React from 'react'
import './Features.css'

const Features = ({ language }) => {
  const features = {
    english: [
      {
        icon: '📄',
        title: 'Unlimited Document Uploads',
        description: 'Upload unlimited documents in various formats including PDF, PPT, DOCX, JPG, PNG, and more.'
      },
      {
        icon: '🤖',
        title: 'RAG-Based Q&A',
        description: 'Ask questions based on your uploaded documents and get accurate answers using Retrieval-Augmented Generation.'
      },
      {
        icon: '🌐',
        title: 'Multilingual Support',
        description: 'Chat in English, Hindi, or Hinglish. The chatbot understands and responds in your preferred language.'
      },
      {
        icon: '💾',
        title: 'Chat History',
        description: 'All your conversations are automatically saved. Access your chat history anytime.'
      },
      {
        icon: '🎤',
        title: 'Speech to Text',
        description: 'Use your voice to ask questions. Click the microphone icon and speak naturally.'
      },
      {
        icon: '🌓',
        title: 'Dark & Light Mode',
        description: 'Switch between beautiful dark (black & white) and light (blue & white) themes for comfortable viewing.'
      },
      {
        icon: '🔍',
        title: 'Smart Document Processing',
        description: 'Advanced OCR for images, text extraction from presentations, and intelligent chunking for better context.'
      },
      {
        icon: '⚡',
        title: 'Fast & Accurate',
        description: 'Powered by LangChain and vector databases for fast retrieval and accurate responses.'
      }
    ],
    hindi: [
      {
        icon: '📄',
        title: 'असीमित दस्तावेज़ अपलोड',
        description: 'PDF, PPT, DOCX, JPG, PNG और अन्य विभिन्न प्रारूपों में असीमित दस्तावेज़ अपलोड करें।'
      },
      {
        icon: '🤖',
        title: 'RAG-आधारित प्रश्नोत्तर',
        description: 'अपने अपलोड किए गए दस्तावेज़ों के आधार पर प्रश्न पूछें और Retrieval-Augmented Generation का उपयोग करके सटीक उत्तर प्राप्त करें।'
      },
      {
        icon: '🌐',
        title: 'बहुभाषी समर्थन',
        description: 'अंग्रेजी, हिंदी या हिंग्लिश में चैट करें। चैटबॉट आपकी पसंदीदा भाषा में समझता है और जवाब देता है।'
      },
      {
        icon: '💾',
        title: 'चैट इतिहास',
        description: 'आपकी सभी बातचीत स्वचालित रूप से सहेजी जाती है। कभी भी अपना चैट इतिहास देखें।'
      },
      {
        icon: '🎤',
        title: 'स्पीच टू टेक्स्ट',
        description: 'प्रश्न पूछने के लिए अपनी आवाज़ का उपयोग करें। माइक्रोफोन आइकन पर क्लिक करें और स्वाभाविक रूप से बोलें।'
      },
      {
        icon: '🌓',
        title: 'डार्क और लाइट मोड',
        description: 'आरामदायक देखने के लिए सुंदर डार्क (काला और सफेद) और लाइट (नीला और सफेद) थीम के बीच स्विच करें।'
      },
      {
        icon: '🔍',
        title: 'स्मार्ट दस्तावेज़ प्रसंस्करण',
        description: 'छवियों के लिए उन्नत OCR, प्रस्तुतियों से पाठ निष्कर्षण, और बेहतर संदर्भ के लिए बुद्धिमान चंकिंग।'
      },
      {
        icon: '⚡',
        title: 'तेज़ और सटीक',
        description: 'तेज़ पुनर्प्राप्ति और सटीक प्रतिक्रियाओं के लिए LangChain और वेक्टर डेटाबेस द्वारा संचालित।'
      }
    ],
    hinglish: [
      {
        icon: '📄',
        title: 'Unlimited Documents Upload',
        description: 'PDF, PPT, DOCX, JPG, PNG aur bhi kayi formats mein unlimited documents upload karein.'
      },
      {
        icon: '🤖',
        title: 'RAG-Based Q&A',
        description: 'Apne uploaded documents ke basis par sawal puchhein aur Retrieval-Augmented Generation use karke accurate answers paayein.'
      },
      {
        icon: '🌐',
        title: 'Multilingual Support',
        description: 'English, Hindi, ya Hinglish mein chat karein. Chatbot aapki preferred language mein samajhta hai aur respond karta hai.'
      },
      {
        icon: '💾',
        title: 'Chat History',
        description: 'Aapki saari conversations automatically save hoti hain. Kabhi bhi apna chat history access karein.'
      },
      {
        icon: '🎤',
        title: 'Speech to Text',
        description: 'Sawal puchhne ke liye apni awaaz use karein. Microphone icon par click karein aur naturally bolein.'
      },
      {
        icon: '🌓',
        title: 'Dark & Light Mode',
        description: 'Comfortable viewing ke liye beautiful dark (black & white) aur light (blue & white) themes ke beech switch karein.'
      },
      {
        icon: '🔍',
        title: 'Smart Document Processing',
        description: 'Images ke liye advanced OCR, presentations se text extraction, aur better context ke liye intelligent chunking.'
      },
      {
        icon: '⚡',
        title: 'Fast & Accurate',
        description: 'Fast retrieval aur accurate responses ke liye LangChain aur vector databases se powered.'
      }
    ]
  }

  const currentFeatures = features[language] || features.english

  return (
    <div className="features">
      <h2>✨ Features</h2>
      <p className="features-intro">
        Discover all the powerful features of our RAG Chatbot
      </p>
      
      <div className="features-grid">
        {currentFeatures.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features


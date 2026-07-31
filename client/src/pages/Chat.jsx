import { useState } from "react";
import api from "../api/client";

function Chat() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I am GovAssist AI. How can I help you with government schemes?"
    }
  ]);
  const [loading, setLoading] = useState(false);


  const sendMessage = async () => {

    const trimmed = message.trim();
    if(trimmed==="") return;

    const userMessage = trimmed;

    setChat((prev) => [
      ...prev,
      {
        sender:"user",
        text:userMessage
      },
      {
        sender:"ai",
        text:"I am analyzing your query 🤖"
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const profile = JSON.parse(localStorage.getItem("userProfile") || "null") || {};
      const response = await api.post("/ai/chat", {
        message: userMessage,
        profile,
      });
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "ai",
          text: response.data.reply || "I can help with eligibility, documents, and deadlines.",
        };
        return updated;
      });
    } catch (err) {
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "ai",
          text: err.response?.data?.message || "I could not answer that right now. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }

  };


  return (

    <div className="chat-page">


      <div className="chat-container">


        <h1>
          🤖 GovAssist AI Assistant
        </h1>


        <div className="chat-box">

          {
            chat.map((msg,index)=>(

              <div 
              key={index}
              className={msg.sender}
              >

                {msg.text}

              </div>

            ))
          }

        </div>



        <div className="chat-input">

          <input

          value={message}

          onChange={(e)=>setMessage(e.target.value)}

          placeholder="Ask about government schemes..."

          />


          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>


        </div>



      </div>


    </div>

  );

}


export default Chat;
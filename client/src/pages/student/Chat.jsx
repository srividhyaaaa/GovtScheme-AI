import { useState } from "react";

function Chat() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "Hello 👋 I am GovAssist AI. How can I help you with government schemes?"
    }
  ]);


  const sendMessage = () => {

    if(message.trim()==="") return;


    setChat([
      ...chat,
      {
        sender:"user",
        text:message
      },
      {
        sender:"ai",
        text:"I am analyzing your query 🤖. This feature will connect with AI NLP soon."
      }
    ]);


    setMessage("");

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


          <button onClick={sendMessage}>
            Send
          </button>


        </div>



      </div>


    </div>

  );

}


export default Chat;
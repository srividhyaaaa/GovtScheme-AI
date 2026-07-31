import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../hooks/useAuth";
import { sendChatMessage } from "../../services/aiService";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createSession = (title = "New chat") => ({
  id: createId(),
  title,
  createdAt: new Date().toISOString(),
  messages: [],
});

const defaultSuggestions = [
  "How do I apply for a scholarship?",
  "What documents are usually required?",
  "Which scheme fits my profile best?",
  "How do I check eligibility quickly?",
];

function Chat() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(() => {
    if (typeof window === "undefined") {
      return [createSession("New chat")];
    }

    try {
      const stored = window.localStorage.getItem("govassist-chat-sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load chat sessions", error);
    }

    return [createSession("New chat")];
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem("govassist-chat-sessions");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed[0] ? parsed[0].id : null;
    } catch (error) {
      return null;
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryPrompt, setRetryPrompt] = useState("");
  const messagesEndRef = useRef(null);

  const activeSession = useMemo(() => {
    return sessions.find((session) => session.id === currentSessionId) || sessions[0];
  }, [sessions, currentSessionId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("govassist-chat-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isSending]);

  const createMessage = (sender, content, options = {}) => ({
    id: options.id || createId(),
    sender,
    content,
    ...options,
  });

  const sendPrompt = async (promptText, shouldRetry = false) => {
    const trimmed = promptText.trim();
    if (!trimmed || isSending) return;

    const sessionId = currentSessionId || (sessions[0]?.id || createSession().id);
    const userMessage = createMessage("user", trimmed);
    const loadingMessage = createMessage("ai", "", { isLoading: true, id: createId() });

    setSessions((previousSessions) => {
      const existingSession = previousSessions.find((session) => session.id === sessionId);

      if (existingSession) {
        return previousSessions.map((session) => {
          if (session.id !== sessionId) return session;
          const nextMessages = [...session.messages, userMessage, loadingMessage];
          return {
            ...session,
            title: session.title === "New chat" ? trimmed.slice(0, 40) : session.title,
            messages: nextMessages,
          };
        });
      }

      const newSession = createSession(trimmed.slice(0, 40));
      return [...previousSessions, { ...newSession, messages: [userMessage, loadingMessage] }];
    });

    setCurrentSessionId(sessionId);
    setInputValue("");
    setErrorMessage("");
    setRetryPrompt("");
    setIsSending(true);

    try {
      const response = await sendChatMessage({
        message: trimmed,
        profile: {
          fullName: user?.name || user?.fullName || "Student",
          state: user?.state || "All India",
          course: user?.course || user?.degree || "All Courses",
          cgpa: user?.cgpa || user?.gpa || 0,
          familyIncome: user?.familyIncome || user?.annualIncome || 0,
          category: user?.category || user?.socialCategory || "General",
        },
      });

      const reply = response.reply || "I can help with eligibility, documents, deadlines, and application steps.";

      setSessions((previousSessions) =>
        previousSessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            messages: session.messages.map((message) => {
              if (message.id === loadingMessage.id) {
                return createMessage("ai", reply, { id: message.id });
              }
              return message;
            }),
          };
        })
      );
    } catch (error) {
      const fallbackReply = error.response?.data?.message || "The assistant is temporarily unavailable. Please try again in a moment.";
      setSessions((previousSessions) =>
        previousSessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            messages: session.messages.map((message) => {
              if (message.id === loadingMessage.id) {
                return createMessage("ai", fallbackReply, { id: message.id, isError: true });
              }
              return message;
            }),
          };
        })
      );
      setErrorMessage("The assistant could not respond. Please retry with a shorter message or check your connection.");
      setRetryPrompt(shouldRetry ? "" : trimmed);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPrompt(inputValue);
  };

  const startNewSession = () => {
    const freshSession = createSession("New chat");
    setSessions((previousSessions) => [freshSession, ...previousSessions]);
    setCurrentSessionId(freshSession.id);
    setInputValue("");
    setErrorMessage("");
    setRetryPrompt("");
  };

  const selectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setErrorMessage("");
    setRetryPrompt("");
  };

  const renderMessage = (message) => {
    if (message.isLoading) {
      return (
        <div className="typing-indicator" aria-label="Assistant is typing">
          <span />
          <span />
          <span />
        </div>
      );
    }

    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>;
  };

  return (
    <div className="chat-page">
      <div className="chat-shell">
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <div>
              <p className="sidebar-eyebrow">Conversation history</p>
              <h2>Scholar AI</h2>
            </div>
            <button type="button" className="secondary-button sidebar-button" onClick={startNewSession}>
              New chat
            </button>
          </div>

          <div className="suggestion-list">
            {defaultSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="suggestion-pill"
                onClick={() => sendPrompt(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="session-list">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                className={`session-item ${session.id === currentSessionId ? "active" : ""}`}
                onClick={() => selectSession(session.id)}
              >
                <span>{session.title || "New chat"}</span>
                <small>{new Date(session.createdAt).toLocaleDateString()}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-panel-header">
            <div>
              <p className="sidebar-eyebrow">AI assistant</p>
              <h1>GovAssist AI</h1>
            </div>
            <div className="panel-status">
              <span className="status-dot" />
              Online • Gemini
            </div>
          </div>

          <div className="chat-box">
            {(activeSession?.messages || []).map((message) => (
              <div key={message.id} className={`message-bubble ${message.sender}`}>
                <div className={`message-card ${message.isError ? "error" : ""}`}>
                  {renderMessage(message)}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="message-bubble ai">
                <div className="message-card typing-card">
                  <div className="typing-indicator" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
            {retryPrompt ? (
              <button type="button" className="retry-button" onClick={() => sendPrompt(retryPrompt, true)}>
                Retry: “{retryPrompt}”
              </button>
            ) : null}
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask about scholarships, documents, deadlines, or eligibility..."
                autoComplete="off"
              />
              <button type="submit" disabled={isSending || !inputValue.trim()}>
                {isSending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chat;
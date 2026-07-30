import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">

      <div className="hero-text">

        <h1>
          Find Government Schemes Easily with AI
        </h1>

        <p>
          GovAssist AI helps citizens discover Central and State Government
          schemes based on their eligibility using Artificial Intelligence.
        </p>

        <div className="hero-buttons">

          <Link to="/schemes">
            <button className="primary-btn">
              Explore Schemes
            </button>
          </Link>

          <Link to="/chat">
            <button className="secondary-btn">
              Ask AI Assistant
            </button>
          </Link>

        </div>

      </div>

      <div className="hero-card">

        <h2>🤖 AI Assistant</h2>

        <p>
          Ask questions in simple language and receive personalized
          government scheme recommendations instantly.
        </p>

        <ul className="ai-assistant-list">
          <li>✔ Personalized Suggestions</li>
          <li>✔ Eligibility Check</li>
          <li>✔ Multi-language Support</li>
          <li>✔ Free to Use</li>
          <li>✔ GPT-powered Scheme Guidance</li>
        </ul>

      </div>

    </section>
  );
}

export default Home;
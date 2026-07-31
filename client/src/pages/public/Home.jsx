import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <section className="hero-shell">
        <div className="hero-panel hero-copy">
          <p className="eyebrow">AI-guided public service discovery</p>
          <h1>Find the right government support in minutes.</h1>
          <p>
            GovAssist AI helps students and families discover central and state government schemes based on income, education, location, and eligibility.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/schemes">Explore schemes</Link>
            <Link className="secondary-button" to="/chat">Ask AI Assistant</Link>
            <button type="button" className="secondary-button" onClick={() => setShowHowItWorks(true)}>How it works</button>
          </div>
          <div className="hero-highlights">
            <div>
              <strong>4.9/5</strong>
              <span>student satisfaction</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>AI guidance</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>free to explore</span>
            </div>
          </div>
        </div>

        <div className="hero-panel hero-card">
          <h2>🤖 AI Assistant</h2>
          <p>Ask questions in simple language and receive personalized government scheme recommendations instantly.</p>
          <ul className="ai-assistant-list">
            <li>Personalized suggestions</li>
            <li>Eligibility checks</li>
            <li>Multi-language support</li>
            <li>Free to use</li>
            <li>Smart roadmap guidance</li>
          </ul>
        </div>
      </section>

      <Modal
        open={showHowItWorks}
        title="How GovAssist AI works"
        onClose={() => setShowHowItWorks(false)}
        actions={(
          <button type="button" className="primary-button" onClick={() => setShowHowItWorks(false)}>Got it</button>
        )}
      >
        <p>Share a bit about your profile, browse relevant schemes, and let the assistant guide you through eligibility, documents, and next steps.</p>
      </Modal>
    </>
  );
}

export default Home;
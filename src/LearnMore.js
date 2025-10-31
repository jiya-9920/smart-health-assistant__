// src/LearnMore.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LearnMore.css";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="learnmore-container">
      {/* 🌟 Hero Section */}
      <section className="learnmore-hero">
        <h1>Empowering Smarter Health Decisions</h1>
        <p>
          Smart Health Assistant uses Machine Learning to transform your
          health data into actionable insights. Discover how technology can help
          predict, prevent, and personalize your healthcare journey.
        </p>
        <button className="cta-button" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </section>

      {/* 💡 Features Section */}
      <section className="learnmore-section">
        <h2>What Makes It Smart?</h2>
        <div className="cards-container">
          <div className="card">
            <h3>🏥 Disease Risk Detection</h3>
            <p>
              Predict potential diseases such as diabetes or heart problems
              based on your daily health parameters and patterns.
            </p>
          </div>
          <div className="card">
            <h3>📈 Real-Time Health Tracking</h3>
            <p>
              Analyze patterns, measure improvements, and make informed lifestyle choices with clear visual insights.
            </p>
          </div>
          <div className="card">
            <h3>🧠 Personalized Recommendations</h3>
            <p>
              “The AI analyzes your current health inputs to give personalized predictions and advice.”
            </p>
          </div>
        </div>
      </section>

      {/* ⚙️ How It Works Section */}
      <section className="learnmore-section alt-bg">
        <h2>How It Works</h2>
        <ol>
          <li>📋 You input your key health data (like glucose, blood pressure, BMI).</li>
          <li>🧮 Our ML model analyzes your inputs using trained algorithms.</li>
          <li>💡 It predicts possible risks and provides health suggestions.</li>
          <li>📊 View your personalized risk trends and track how your health risk level changes over time..</li>
        </ol>
      </section>

      {/* 🌱 Benefits Section */}
      <section className="learnmore-section">
        <h2>Why Choose Smart Health Assistant?</h2>
        <ul className="benefits-list">
          <li>✅ Early detection for better prevention</li>
          <li>✅ Data-driven and evidence-based analysis</li>
          <li>✅ Easy-to-understand insights and visuals</li>
          <li>✅ Accessible anytime, anywhere</li>
        </ul>
      </section>

      {/* 🔙 Back Button */}
      <div className="back-btn-container">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default LearnMore;

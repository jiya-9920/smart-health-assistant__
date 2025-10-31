import React, { useEffect, useRef } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.3 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLearnMore = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-page">
      {/* 🌟 Hero Section */}
      <section className="landing-section">
        <h1>Smart Health Assistant 🩺</h1>
        <p>
          Your personalized health companion powered by intelligent machine
          learning predictions. Get real-time health insights and early warnings
          to take control of your wellbeing.
        </p>
        <div className="button-group">
          <button onClick={() => navigate("/signup")} className="landing-button">
            Get Started
          </button>
          <button onClick={() => navigate("/learnmore")} className="landing-button">
            Learn More
          </button>
        </div>
      </section>

      {/* 💡 About Section */}
      <section id="about-section" ref={aboutRef} className="about-section fade-in-section">
        <h2>ML-Based Predictions</h2>
        <p>
          The application leverages advanced machine learning algorithms to
          predict potential health risks such as diabetes, heart disease, and
          hypertension. By analyzing key health parameters like blood pressure,
          glucose, and BMI, it provides accurate and early insights to support
          timely medical guidance.
        </p>

        <div className="cards-container">
          <div className="card">
            <h3>🏥 Disease Risk Detection</h3>
            <p>
              Identify early warning signs of major lifestyle diseases with high
              accuracy.
            </p>
          </div>
          <div className="card">
            <h3>📈 Health Data Visualization </h3>
            <p>
              Track your wellness journey with interactive risk charts that show how your health risk levels change over time.
              
            </p>
          </div>
          <div className="card">
            <h3>🧠 Personalized Insights</h3>
            <p>
              Machine learning adapts to your health profile for customized
              suggestions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


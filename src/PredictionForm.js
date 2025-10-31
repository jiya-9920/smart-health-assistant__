// src/PredictionForm.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./PredictionForm.css";

function PredictionForm({ user }) {
  const [age, setAge] = useState("");
  const [bp, setBp] = useState("");
  const [glucose, setGlucose] = useState("");
  const [bmi, setBmi] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [maxHeartRate, setMaxHeartRate] = useState("");
  const [sex, setSex] = useState("1");
  const [cp, setCp] = useState("0");
  const [modelType, setModelType] = useState("diabetes");
  const [prediction, setPrediction] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [predictionIsRisky, setPredictionIsRisky] = useState(false);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // Detect risky predictions
  const checkIfRisky = (pred) => {
    const lower = pred.toLowerCase();
    const riskyWords = ["diabetes", "heart", "hypertension", "disease", "risk", "high", "positive"];
    const negativeWords = ["no", "not", "normal", "healthy", "negative"];
    return riskyWords.some((word) => lower.includes(word)) && !negativeWords.some((word) => lower.includes(word));
  };

  // Fetch previous records
  useEffect(() => {
    if (!user) return;
    const fetchRecords = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users", user.uid, "records"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => b.timestamp?.toDate?.() - a.timestamp?.toDate?.() || new Date(b.timestamp) - new Date(a.timestamp));
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [user]);

  // Predict
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction("");
    setAdvice("");
    setPredictionIsRisky(false);

    try {
      let payload = { model_type: modelType, age, bp };

      if (modelType === "diabetes") payload = { ...payload, glucose, bmi };
      else if (modelType === "heart") payload = { ...payload, cholesterol, max_heart_rate: maxHeartRate, sex, cp };
      else if (modelType === "hypertension") payload = { ...payload, cholesterol, max_heart_rate: maxHeartRate };

      // 🌐 Updated API URL (hosted backend)
      const response = await axios.post("https://smart-health-backend-3.onrender.com/predict", payload);
      const result = response.data.prediction || "No prediction received";

      const isRisky = checkIfRisky(result);
      setPredictionIsRisky(isRisky);
      setPrediction(result);

      // Advice
      let doctorAdvice = "";
      if (result.toLowerCase().includes("diabetes") && isRisky) doctorAdvice = "Monitor glucose and consult a doctor.";
      else if (result.toLowerCase().includes("heart") && isRisky) doctorAdvice = "Maintain a heart-healthy diet and exercise.";
      else if (result.toLowerCase().includes("hypertension") && isRisky) doctorAdvice = "Monitor BP and consult your doctor.";
      else doctorAdvice = "Keep a healthy lifestyle.";
      setAdvice(doctorAdvice);

      // ✅ Realistic risk calculation
      let riskScore = 0;
      if (modelType === "diabetes") {
        riskScore = Math.round(Math.min(100, Number(age) * 0.3 + Number(glucose) * 0.5 + Number(bmi) * 0.2));
      } else if (modelType === "heart") {
        riskScore = Math.round(Math.min(100, Number(age) * 0.25 + Number(cholesterol) * 0.4 + Number(maxHeartRate) * 0.25 + (sex === "1" ? 5 : 0)));
      } else if (modelType === "hypertension") {
        riskScore = Math.round(Math.min(100, Number(age) * 0.3 + Number(bp) * 0.5 + Number(cholesterol) * 0.2));
      }
      if (!isRisky) riskScore = Math.max(0, riskScore - 20);

      // Save record
      if (user) {
        const newRecord = {
          ...payload,
          prediction: result,
          advice: doctorAdvice,
          risk: riskScore,
          timestamp: new Date(), // always save timestamp
        };
        await addDoc(collection(db, "users", user.uid, "records"), newRecord);
        setRecords((prev) => [newRecord, ...prev]);
      }
    } catch (error) {
      console.error(error);
      setPrediction("⚠️ Unable to connect to server.");
      setAdvice("");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="prediction-form-wrapper">
        <div className="prediction-form-container">
          <p className="login-message">
            Please <Link to="/login">login</Link> or <Link to="/signup">signup</Link> to use the Health Assistant.
          </p>
        </div>
      </div>
    );

  return (
    <div className="prediction-form-wrapper">
      <div className="prediction-form-container">
        <h2>Smart Health Assistant 🩺</h2>
        <p>Welcome, {user?.displayName || user?.email}!</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>

        <select className="form-select" value={modelType} onChange={(e) => setModelType(e.target.value)}>
          <option value="diabetes">Diabetes Prediction</option>
          <option value="heart">Heart Disease Prediction</option>
          <option value="hypertension">Hypertension Prediction</option>
        </select>

        <form onSubmit={handleSubmit}>
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
          <input type="number" placeholder="BP" value={bp} onChange={(e) => setBp(e.target.value)} required />

          {modelType === "diabetes" && <>
            <input type="number" placeholder="Glucose" value={glucose} onChange={(e) => setGlucose(e.target.value)} required />
            <input type="number" placeholder="BMI" value={bmi} onChange={(e) => setBmi(e.target.value)} required />
          </>}

          {modelType === "heart" && <>
            <input type="number" placeholder="Cholesterol" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} required />
            <input type="number" placeholder="Max Heart Rate" value={maxHeartRate} onChange={(e) => setMaxHeartRate(e.target.value)} required />
            <select value={sex} onChange={(e) => setSex(e.target.value)} required>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
            <select value={cp} onChange={(e) => setCp(e.target.value)} required>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </>}

          {modelType === "hypertension" && <>
            <input type="number" placeholder="Cholesterol" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} required />
            <input type="number" placeholder="Max Heart Rate" value={maxHeartRate} onChange={(e) => setMaxHeartRate(e.target.value)} required />
          </>}

          <button type="submit" disabled={loading}>{loading ? "Analyzing..." : "Predict"}</button>
        </form>

        {prediction && <h3 className={`result ${predictionIsRisky ? "risky" : "healthy"}`}>{prediction}</h3>}
        {advice && <h3 className={`result ${predictionIsRisky ? "risky" : "healthy"}`}>{advice}</h3>}

        {/* Open HTML Risk Chart */}
        {records.length > 0 && (
          <button
            className="prediction-form-button"
            onClick={() => window.open(process.env.PUBLIC_URL + "/risk_chart.html", "_blank")}
          >
            Open Risk Chart 📈
          </button>
        )}

        {/* Previous Records */}
        {records.length > 0 && (
          <div className="records-section">
            <h3>Previous Records</h3>
            {records.map((rec, idx) => {
              const isRisky = checkIfRisky(rec.prediction);
              const time = rec.timestamp?.toDate ? rec.timestamp.toDate() : new Date(rec.timestamp);
              return (
                <div key={idx} className={`record ${isRisky ? "risky" : "healthy"}`}>
                  <p><strong>Type:</strong> {rec.model_type}</p>
                  <p><strong>Prediction:</strong> {rec.prediction}</p>
                  <p><strong>Advice:</strong> {rec.advice}</p>
                  <p><strong>Risk Score:</strong> {rec.risk}</p>
                  <p><strong>Date:</strong> {time.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {time.toLocaleTimeString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;

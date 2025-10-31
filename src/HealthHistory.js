// src/HealthHistory.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

function HealthHistory() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const recordsRef = collection(db, "users", currentUser.uid, "records");
        const q = query(recordsRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading records...</p>;
  if (!user) return <p>Please log in to view your history.</p>;

  return (
    <div className="container">
      <h2>📊 Your Health Records</h2>
      <Link to="/" style={{ marginBottom: "15px", display: "inline-block" }}>
        ⬅ Back to Dashboard
      </Link>

      {records.length === 0 ? (
        <p>No records found yet.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>BP</th>
              <th>Glucose</th>
              <th>BMI</th>
              <th>Prediction</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.timestamp?.toDate().toLocaleString() || "—"}</td>
                <td>{r.bp}</td>
                <td>{r.glucose}</td>
                <td>{r.bmi}</td>
                <td>{r.prediction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HealthHistory;

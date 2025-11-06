import axios from "axios";

/**
 * Sends health data to Flask backend for prediction.
 * @param {string} modelType - "diabetes", "heart", or "hypertension"
 * @param {Object} formData - The input data fields
 * @returns {Promise<Object>} - { prediction: string }
 */
export const getPrediction = async (modelType, formData) => {
  try {
    const payload = {
      model_type: modelType,
      ...formData,
    };

    const response = await axios.post("https://smart-health-backend-4.onrender.com", payload);
    return response.data;
  } catch (error) {
    console.error("Error calling backend:", error);
    return { prediction: "⚠️ Unable to connect to server." };
  }
};




import React, { useState } from "react";
import Doctor from "../assets/doctor.svg";
import "./Diagnosis.css";

const Diagnosis = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.130.122:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${API_URL}/analyze/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({
        text_analysis: {
          condition: "Error",
          causes: "Connection issue",
          suggestion: "Please try again.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="diagnosis-page">
      <h2 className="heading">Welcome to your online Clinic!</h2>

      {/* Doctor Image and Intro Text */}
      <div className="diagnosis-content">
        <div className="image-holder">
          <img src={Doctor} alt="Doctor Illustration" />
        </div>

        <div className="text-holder">
          <h3>Meet Your AI Dermatologist</h3>
          <p>
            At <strong>Viani</strong>, we combine the power of AI and the care of dermatological science to help you
            understand your skin better. Whether it’s acne, irritation, or pigmentation, our system helps you identify
            possible causes and get quick, accurate insights- all from the comfort of your home.
          </p>
          <p>
            We deeply value your <strong>privacy</strong> and your <strong>trust</strong>. Your uploaded data and
            images are handled securely and are never shared. Every analysis is processed anonymously through our
            advanced AI models to ensure you get reliable suggestions without compromising your personal information.
          </p>
          <p>
            Our AI doesn’t replace doctors- it helps you take the <strong>first confident step</strong> toward healthy
            skin. After getting your AI-based diagnosis, you can connect directly with certified dermatologists for
            expert consultation.
          </p>
        </div>
      </div>

      {/* AI Form */}
      <div className="form-intro">
        <h3>Start Your Diagnosis</h3>
        <p>
          Describe your skin issue in your own words and upload a photo (optional). Our AI will analyze your input and
          provide a detailed report including possible conditions, causes, and suggested care steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="diagnosis-form">
        <textarea
          placeholder="Describe your problem (e.g., red rash on hand, acne on face)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Get Diagnosis"}
        </button>
      </form>

      {/*RESULTS SECTION */}
      {result && (
        <div className="result-box fade-in">
          <h3>AI Diagnosis Result</h3>
          <div className="result-item">
            <strong>Condition:</strong>{" "}
            {result.text_analysis?.condition || "N/A"}
          </div>
          <div className="result-item">
            <strong>Causes:</strong> {result.text_analysis?.causes || "N/A"}
          </div>
          <div className="result-item">
            <strong>Suggestion:</strong>{" "}
            {result.text_analysis?.suggestion || "N/A"}
          </div>
          <div className="result-item">
            <strong>Seriousness:</strong>{" "}
            {result.text_analysis?.seriousness || "N/A"}
          </div>

          {result.image_analysis && (
            <>
              <hr />
              <h4>Image Analysis</h4>
              <div className="result-item">
                <strong>Prediction:</strong>{" "}
                {result.image_analysis.predicted_label}
              </div>
              <div className="result-item">
                <strong>Confidence:</strong>{" "}
                {result.image_analysis.confidence}%
              </div>
            </>
          )}

          <hr />
          <div className="result-item recommendation">
            <strong>Recommendation:</strong> {result.recommendation}
          </div>
        </div>
      )}
    </section>
  );
};

export default Diagnosis;

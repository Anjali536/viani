import React from "react";
import about from "../assets/about.svg";
import "./About.css";

const About = () => {
  return (
    <section id="about" className="about">
      <h2 className="about-heading">About Viani</h2>

      <div className="about-container">
        <div className="about-text">
          <p>
            <strong>Viani</strong> is a next-generation healthcare initiative focused on
            empowering individuals to take charge of their skin health. By combining
            Artificial Intelligence with dermatological expertise, Viani bridges the gap
            between users and early detection of common skin conditions.
          </p>
          <p>
            Our mission is to make skin diagnosis simple, affordable, and accessible to
            everyone- especially in areas with limited access to dermatologists. Through
            advanced AI algorithms, Viani can interpret text descriptions of symptoms,
            analyze uploaded skin images, and even connect users with qualified doctors
            for accurate consultation.
          </p>
          <p>
            Currently, our research team is developing deeper integrations using computer
            vision, natural language processing, and cloud-based APIs to provide even
            faster and more accurate analysis. <strong>Viani</strong> isn’t just an app-
            it’s your personal digital skin expert.
          </p>
        </div>

         <div className="about-image-container">
          <img src={about} alt="About Viani" className="about-image" />
        </div>
      
      </div>

      <div className="vision">
        <h3>Our Vision</h3>
        <p>
          At Viani, we envision a world where technology bridges the gap between people and
          quality skin healthcare. Our goal is to create a future where anyone—regardless
          of geography, age, or income—can instantly understand their skin’s condition
          using AI-powered insights. We believe in empowering individuals to take control
          of their health through intelligent, accessible, and user-friendly digital tools.
        </p>
      </div>
    </section>
  );
};

export default About;

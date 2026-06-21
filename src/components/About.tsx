import "./styles/About.css";
import { portfolioConfig } from "../data/portfolioConfig";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          {portfolioConfig.personalInfo.bio}
        </p>
      </div>
    </div>
  );
};

export default About;

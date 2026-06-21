import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { portfolioConfig } from "../data/portfolioConfig";

const Landing = ({ children }: PropsWithChildren) => {
  const { firstName, lastName, role1, role2 } = portfolioConfig.personalInfo;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName}
              <br />
              <span>{lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{role2}</div>
              <div className="landing-h2-2">{role1}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{role1}</div>
              <div className="landing-h2-info-1">{role2}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;

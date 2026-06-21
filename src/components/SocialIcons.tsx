import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { portfolioConfig } from "../data/portfolioConfig";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {portfolioConfig.socialLinks.github && (
          <span>
            <a href={portfolioConfig.socialLinks.github} target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
          </span>
        )}
        {portfolioConfig.socialLinks.linkedin && (
          <span>
            <a href={portfolioConfig.socialLinks.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedinIn />
            </a>
          </span>
        )}
        {portfolioConfig.socialLinks.twitter && (
          <span>
            <a href={portfolioConfig.socialLinks.twitter} target="_blank" rel="noreferrer">
              <FaXTwitter />
            </a>
          </span>
        )}
      </div>
      {portfolioConfig.personalInfo.resumeUrl && (
        <a className="resume-button" href={portfolioConfig.personalInfo.resumeUrl} target="_blank" rel="noreferrer">
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      )}
    </div>
  );
};

export default SocialIcons;

import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { portfolioConfig } from "../data/portfolioConfig";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`, // Use actual scroll width
        scrub: true,
        pin: true,
        id: "work",
        onToggle: (self) => {
          const pinEl = self.pin as HTMLElement | null;
          const spacer = pinEl?.parentElement;
          if (spacer && spacer.classList.contains("pin-spacer")) {
            spacer.style.zIndex = self.isActive ? "2" : "";
          }
        },
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {portfolioConfig.projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <div className="work-description-text" style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#adacac" }}>{project.description}</p>
                </div>
                <h4>Tools and features</h4>
                <p style={{ marginBottom: "20px" }}>{project.tools.join(", ")}</p>
                
                <div className="work-links" style={{ display: "flex", gap: "20px" }}>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="work-project-link" style={{ color: "var(--accentColor)", textDecoration: "underline", fontSize: "14px" }} data-cursor="disable">
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="work-project-link" style={{ color: "var(--accentColor)", textDecoration: "underline", fontSize: "14px" }} data-cursor="disable">
                      GitHub Repo
                    </a>
                  )}
                </div>
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

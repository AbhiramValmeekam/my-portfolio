import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  if (percent >= 100) {
    setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }, 600);
  }

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      }
    });
  }, [isLoaded, setIsLoading]);

  // Determine which cute cartoon face to show based on percentage
  const getCartoonFace = () => {
    if (percent < 25) return "😴";
    if (percent < 50) return "🤔";
    if (percent < 75) return "🙂";
    if (percent < 99) return "🤩";
    return "🥳";
  };

  const getStatusMessage = () => {
    if (percent < 25) return "Zzz... waking up the servers...";
    if (percent < 50) return "Gathering cute ideas...";
    if (percent < 75) return "Baking the 3D models...";
    if (percent < 99) return "Adding magic sparkles...";
    return "Tada! Everything is ready!";
  };

  const loadingText = "LOADING...";

  return (
    <div className={`cartoon-preloader-container ${clicked ? "cartoon-preloader-exit" : ""}`}>
      {/* Playful cartoon background grid */}
      <div className="cartoon-bg-grid"></div>

      <div className="cartoon-card">
        {/* Animated Cartoon Face / Blob */}
        <div className="cartoon-face-wrapper">
          <div className="cartoon-face-shadow"></div>
          <div className="cartoon-face">
            <span className="cartoon-emoji">{getCartoonFace()}</span>
          </div>
        </div>

        {/* Playful jumping loading letters */}
        <div className="cartoon-loading-text">
          {loadingText.split("").map((char, index) => (
            <span
              key={index}
              className="cartoon-letter"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Dynamic status helper */}
        <p className="cartoon-status-msg">{getStatusMessage()}</p>

        {/* Cute Comic-style Progress Bar */}
        <div className="cartoon-progress-border">
          <div
            className="cartoon-progress-fill"
            style={{ width: `${percent}%` }}
          >
            {/* Tiny cartoon star indicator at the tip of progress */}
            {percent > 5 && <span className="cartoon-progress-star">⭐</span>}
          </div>
        </div>

        {/* Percentage Badge */}
        <div className="cartoon-badge">
          <span>{percent}%</span>
        </div>
      </div>

      {/* Comic split transition panels */}
      <div className="comic-panel-left"></div>
      <div className="comic-panel-right"></div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};

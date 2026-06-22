import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import Marquee from "react-fast-marquee";
import gsap from "gsap";

const getIcon = (name: string, brandColor: string) => {
  const color = brandColor === "#ffffff" ? "#000000" : brandColor;
  switch (name) {
    case "React":
      return (
        <svg viewBox="-11.5 -10.23 23 20.46" width="18" height="18">
          <circle cx="0" cy="0" r="2.05" fill={color}/>
          <g stroke={color} strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      );
    case "Next.js":
      return (
        <svg viewBox="0 0 128 128" width="18" height="18" fill="none">
          <circle cx="64" cy="64" r="64" fill="#000"/>
          <path d="M101.3 103L53 43v43.5h-7.6V35.6h7.6l44 54.4V35.6h7.6V103h-3.7z" fill="#fff"/>
          <path d="M64 35.6H56v42.5l8 9.9V35.6z" fill="#fff"/>
        </svg>
      );
    case "Node.js":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#43853d">
          <path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm6 12.3l-6 3.4-6-3.4v-6.6l6-3.4 6 3.4v6.6z"/>
        </svg>
      );
    case "Express":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" strokeWidth="2">
          <path d="M4 6h16M4 12h12M4 18h16"/>
        </svg>
      );
    case "MongoDB":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#13aa52">
          <path d="M12 2c0 0-4 4-4 8.5c0 3 1.5 5 4 8.5c2.5-3.5 4-5.5 4-8.5C16 6 12 2 12 2z"/>
        </svg>
      );
    case "PostgreSQL":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#336791">
          <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      );
    case "Tailwind CSS":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#38bdf8">
          <path d="M12 3c-1.2 0-2.4.6-3.1 1.6C7.3 3.9 5.7 3.5 4.5 4.5 3.1 5.6 2.7 7.6 3.6 9.1 2.2 10 1.5 11.6 1.5 13.3c0 2.8 2.2 5.1 4.9 5.3 1 .6 2.3.8 3.5.5 1.5.9 3.3.6 4.5-.6 1.3-1.3 1.6-3.2 1-4.7 1.1-.9 1.7-2.3 1.7-3.8 0-2.8-2.2-5.1-4.9-5.3-.8-.5-1.9-.7-3-.4H12z"/>
        </svg>
      );
    case "GSAP":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#88ce02">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <text x="12" y="16" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#000" textAnchor="middle">G</text>
        </svg>
      );
    case "Three.js":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#000">
          <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z"/>
        </svg>
      );
    case "Docker":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#0db7ed">
          <path d="M2 10h3v3H2zm4 0h3v3H6zm4 0h3v3h-3zm4 0h3v3h-3zm-8-4h3v3H6zm4 0h3v3h-3zm4 0h3v3h-3zm-4-4h3v3h-3z"/>
        </svg>
      );
    case "AWS":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#ff9900">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
        </svg>
      );
    default:
      return null;
  }
};

const TECH_ITEMS = [
  { name: "React", bg: "#00d8ff", textColor: "#000000", borderColor: "#ffffff", borderStyle: "solid", size: 1.1, depth: 3, delay: 0.05, speed: 0.15 },
  { name: "Next.js", bg: "#0b0b0f", textColor: "#ffffff", borderColor: "#3f3f3f", borderStyle: "dashed", size: 1.0, depth: 2, delay: 0.12, speed: 0.12 },
  { name: "Node.js", bg: "#43853d", textColor: "#ffffff", borderColor: "#ffffff", borderStyle: "double", size: 1.05, depth: 3, delay: 0.08, speed: 0.14 },
  { name: "Express", bg: "#ffffff", textColor: "#000000", borderColor: "#000000", borderStyle: "solid", size: 0.9, depth: 1, delay: 0.20, speed: 0.08 },
  { name: "MongoDB", bg: "#13aa52", textColor: "#ffffff", borderColor: "#ffffff", borderStyle: "solid", size: 0.95, depth: 2, delay: 0.15, speed: 0.10 },
  { name: "PostgreSQL", bg: "#336791", textColor: "#ffffff", borderColor: "#00d8ff", borderStyle: "solid", size: 0.85, depth: 1, delay: 0.25, speed: 0.07 },
  { name: "Tailwind CSS", bg: "#38bdf8", textColor: "#000000", borderColor: "#ffffff", borderStyle: "dashed", size: 1.0, depth: 2, delay: 0.10, speed: 0.13 },
  { name: "GSAP", bg: "#88ce02", textColor: "#000000", borderColor: "#000000", borderStyle: "double", size: 1.15, depth: 3, delay: 0.04, speed: 0.18 },
  { name: "Three.js", bg: "#f43f5e", textColor: "#ffffff", borderColor: "#ffffff", borderStyle: "solid", size: 1.2, depth: 3, delay: 0.06, speed: 0.16 },
  { name: "Docker", bg: "#0db7ed", textColor: "#ffffff", borderColor: "#ffffff", borderStyle: "dashed", size: 0.9, depth: 1, delay: 0.18, speed: 0.09 },
  { name: "AWS", bg: "#ff9900", textColor: "#000000", borderColor: "#ffffff", borderStyle: "solid", size: 0.95, depth: 2, delay: 0.14, speed: 0.11 }
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      const tags = gsap.utils.toArray(".preloader-tag");
      gsap.fromTo(
        tags,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.6,
          stagger: 0.04,
          ease: "back.out(1.5)",
        }
      );
    }
  }, [showContent]);

  // Handle tech stacks card trailing (High Performance Snake Effect)
  useEffect(() => {
    const tags = gsap.utils.toArray<HTMLElement>(".preloader-tag");
    if (tags.length === 0) return;

    // Apply random rotation offsets to look like pasted sticker cards
    const rotations = tags.map(() => (Math.random() - 0.5) * 20);
    tags.forEach((t, i) => gsap.set(t, { rotation: rotations[i], xPercent: -50, yPercent: -50, force3D: true }));

    // High performance trailing using lerp and gsap.ticker
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = tags.map(() => ({ x: mouse.x, y: mouse.y }));

    const xSetters = tags.map(t => gsap.quickSetter(t, "x", "px"));
    const ySetters = tags.map(t => gsap.quickSetter(t, "y", "px"));

    // Set initial centered coordinates to avoid jumps
    tags.forEach(t => {
      gsap.set(t, { x: mouse.x, y: mouse.y });
    });

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      // Lerp first tag towards the mouse
      pos[0].x += (mouse.x - pos[0].x) * 0.15;
      pos[0].y += (mouse.y - pos[0].y) * 0.15;
      xSetters[0](pos[0].x);
      ySetters[0](pos[0].y);

      // Lerp subsequent tags towards the one in front of them
      for (let i = 1; i < tags.length; i++) {
        pos[i].x += (pos[i-1].x - pos[i].x) * 0.25; 
        pos[i].y += (pos[i-1].y - pos[i].y) * 0.25;
        xSetters[i](pos[i].x);
        ySetters[i](pos[i].y);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  // Interpolate displayPercent smoothly frame-by-frame to avoid number skipping
  useEffect(() => {
    let animationFrameId: number;
    
    const updateProgress = () => {
      setDisplayPercent((prev) => {
        if (prev < percent) {
          return prev + 1;
        }
        return prev;
      });
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [percent]);

  useEffect(() => {
    if (percent >= 100 && !isCompleted) {
      setIsCompleted(true);
    }
  }, [percent, isCompleted]);

  useEffect(() => {
    if (isCompleted) {
      const t1 = setTimeout(() => {
        setLoaded(true);
        const t2 = setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
        return () => clearTimeout(t2);
      }, 600);
      return () => clearTimeout(t1);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isLoaded) {
      import("./utils/initialFX").then((module) => {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      });
    }
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-screen">
        {/* Background Technical Decorations */}
        <div className="bg-decor-grid-line bg-line-h"></div>
        <div className="bg-decor-grid-line bg-line-v"></div>
        <div className="corner-mark tl"></div>
        <div className="corner-mark tr"></div>
        <div className="corner-mark bl"></div>
        <div className="corner-mark br"></div>
        
        {/* Background Animated Design Elements */}
        <div className="bg-anim-element bg-spin-cube">
          <svg viewBox="0 0 100 100" width="120" height="120" stroke="rgba(255,255,255,0.035)" strokeWidth="1" fill="none">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="5" y1="25" x2="50" y2="50" />
            <line x1="95" y1="25" x2="50" y2="50" />
            <line x1="5" y1="75" x2="50" y2="50" />
            <line x1="95" y1="75" x2="50" y2="50" />
          </svg>
        </div>
        <div className="bg-anim-element bg-float-brackets-l">
          <svg viewBox="0 0 100 100" width="80" height="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none">
            <path d="M30,20 L10,50 L30,80 M70,20 L90,50 L70,80" />
          </svg>
        </div>
        <div className="bg-anim-element bg-float-brackets-r">
          <svg viewBox="0 0 100 100" width="70" height="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none">
            <path d="M30,20 Q60,10 50,50 T70,80" />
          </svg>
        </div>
        <div className="bg-anim-element bg-spin-star-1">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="rgba(255,255,255,0.025)">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
          </svg>
        </div>
        <div className="bg-anim-element bg-spin-star-2">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="rgba(255,255,255,0.02)">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
          </svg>
        </div>
        <div className="bg-anim-element bg-spin-gear">
          <svg viewBox="0 0 100 100" width="85" height="85" stroke="rgba(255,255,255,0.025)" strokeWidth="1.5" fill="none">
            <circle cx="50" cy="50" r="22" />
            <path d="M50,10 L50,20 M50,80 L50,90 M10,50 L20,50 M80,50 L90,50 M22,22 L29,29 M71,71 L78,78 M22,78 L29,71 M71,22 L78,29" />
          </svg>
        </div>
        <div className="bg-anim-element bg-float-circle">
          <svg viewBox="0 0 100 100" width="100" height="100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none">
            <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
            <circle cx="50" cy="50" r="25" />
          </svg>
        </div>
        <div className="bg-anim-element bg-spin-star-3">
          <svg viewBox="0 0 24 24" width="25" height="25" fill="rgba(255,255,255,0.018)">
            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
          </svg>
        </div>
        <div className="bg-anim-element bg-float-tag">
          <svg viewBox="0 0 100 100" width="60" height="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none">
            <path d="M25,40 L45,50 L25,60 M75,40 L55,50 L75,60" />
          </svg>
        </div>
        <div className="bg-anim-element bg-spin-cross">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="rgba(255,255,255,0.02)" strokeWidth="2" fill="none">
            <path d="M12 4v16M4 12h16" />
          </svg>
        </div>

        <div className={`loading-screen-inner ${showContent ? "visible" : "hidden"}`}>
          <div className="loading-marquee">
            <Marquee speed={60}>
              <span>DESIGN & ENGINEERING</span>
              <span className="marquee-divider">✦</span>
              <span>DESIGN & ENGINEERING</span>
              <span className="marquee-divider">✦</span>
              <span>DESIGN & ENGINEERING</span>
              <span className="marquee-divider">✦</span>
            </Marquee>
          </div>
          <div
            className={`loading-wrap ${clicked && "loading-clicked"}`}
            onMouseMove={handleMouseMove}
          >
            <div className="loading-hover"></div>
            <div className={`loading-button ${loaded && "loading-complete"}`}>
              <div className="loading-container">
                <div className="loading-content">
                  <div className="loading-content-in">
                    Loading <span>{displayPercent}%</span>
                  </div>
                </div>
                <div className="loading-box"></div>
              </div>
              <div className="loading-content2">
                <span>Welcome</span>
              </div>
            </div>
          </div>

          {/* Interactive Tech Cards (Trailing) */}
          {TECH_ITEMS.map((item, index) => {
            const blurAmount = item.depth === 1 ? "2px" : "0px";
            const zIndex = item.depth * 10;
            
            return (
              <div
                key={index}
                className="preloader-tag"
                style={{
                  filter: `blur(${blurAmount})`,
                  zIndex: zIndex,
                  backgroundColor: item.bg,
                  borderColor: item.borderColor,
                  borderStyle: item.borderStyle,
                  color: item.textColor,
                }}
              >
                <div className="tag-icon-sticker">
                  {getIcon(item.name, item.bg)}
                </div>
                <span className="tag-name" style={{ color: item.textColor }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let interval: any;
  let startTimeout: any;

  startTimeout = setTimeout(() => {
    interval = setInterval(() => {
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
  }, 1000);

  function clear() {
    clearTimeout(startTimeout);
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearTimeout(startTimeout);
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

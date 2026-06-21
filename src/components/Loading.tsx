import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import gsap from "gsap";

const TECH_ITEMS = [
  { name: "React", color: "#38bdf8", size: 1.1, depth: 3, delay: 0.05, speed: 0.15 },
  { name: "Next.js", color: "#ffffff", size: 1.0, depth: 2, delay: 0.12, speed: 0.12 },
  { name: "Node.js", color: "#22c55e", size: 1.05, depth: 3, delay: 0.08, speed: 0.14 },
  { name: "Express", color: "#a855f7", size: 0.9, depth: 1, delay: 0.20, speed: 0.08 },
  { name: "MongoDB", color: "#10b981", size: 0.95, depth: 2, delay: 0.15, speed: 0.10 },
  { name: "PostgreSQL", color: "#3b82f6", size: 0.85, depth: 1, delay: 0.25, speed: 0.07 },
  { name: "Tailwind CSS", color: "#06b6d4", size: 1.0, depth: 2, delay: 0.10, speed: 0.13 },
  { name: "GSAP", color: "#facc15", size: 1.15, depth: 3, delay: 0.04, speed: 0.18 },
  { name: "Three.js", color: "#f43f5e", size: 1.2, depth: 3, delay: 0.06, speed: 0.16 },
  { name: "Docker", color: "#2563eb", size: 0.9, depth: 1, delay: 0.18, speed: 0.09 },
  { name: "AWS", color: "#f97316", size: 0.95, depth: 2, delay: 0.14, speed: 0.11 }
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  // References for mouse tracking
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const idleTimeRef = useRef(0);

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
        }, 1100);
      }
    });
  }, [isLoaded, setIsLoading]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      idleTimeRef.current = 0; // Reset idle timer on mouse movement
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial setup of quickTo properties for smooth tracking
    const tagElements = gsap.utils.toArray<HTMLElement>(".preloader-tag");
    const quickToActions = tagElements.map((el, i) => {
      const item = TECH_ITEMS[i];
      // Create quickTo animators for smooth interpolation with inertia
      const xTo = gsap.quickTo(el, "x", {
        duration: 1.2 / item.speed,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(el, "y", {
        duration: 1.2 / item.speed,
        ease: "power3.out",
      });
      return { xTo, yTo, item };
    });

    // Swarm ticker logic
    let tickCount = 0;
    const ticker = () => {
      tickCount += 0.015;
      idleTimeRef.current += 1;

      quickToActions.forEach(({ xTo, yTo, item }, index) => {
        // Create an organic orbital offset around the cursor
        const orbitRadius = 90 + item.depth * 35;
        const angle = (index * (360 / TECH_ITEMS.length) * Math.PI) / 180 + tickCount * (item.speed * 0.8);
        
        // Add subtle noise/floating when idle
        const idleFloatX = Math.sin(tickCount + index) * 15;
        const idleFloatY = Math.cos(tickCount * 1.3 + index) * 15;

        // Target position = mouse position + orbit offset + idle float
        const targetX = mouseRef.current.x + Math.cos(angle) * orbitRadius + idleFloatX;
        const targetY = mouseRef.current.y + Math.sin(angle) * orbitRadius + idleFloatY;

        xTo(targetX);
        yTo(targetY);
      });
    };

    gsap.ticker.add(ticker);

    // Animate initial scale and entrance
    gsap.fromTo(
      ".preloader-tag",
      { scale: 0, opacity: 0 },
      {
        scale: (i) => TECH_ITEMS[i].size,
        opacity: (i) => (TECH_ITEMS[i].depth === 3 ? 0.95 : TECH_ITEMS[i].depth === 2 ? 0.7 : 0.45),
        duration: 1.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
      }
    );

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div className={`tech-preloader-container ${clicked ? "preloader-exit-active" : ""}`} ref={containerRef}>
      {/* Soft scanline/noise overlays */}
      <div className="preloader-noise"></div>
      <div className="preloader-radial-glow"></div>

      {/* Interactive Swarm Tags */}
      {TECH_ITEMS.map((item, index) => {
        // Define style attributes based on depth layers
        const blurAmount = item.depth === 1 ? "3px" : "0px";
        const zIndex = item.depth * 10;
        
        return (
          <div
            key={index}
            className="preloader-tag"
            style={{
              borderColor: item.color,
              boxShadow: `0 0 15px ${item.color}33, inset 0 0 10px ${item.color}11`,
              filter: `blur(${blurAmount})`,
              zIndex: zIndex,
            }}
          >
            <span className="tag-dot" style={{ backgroundColor: item.color }}></span>
            <span className="tag-name">{item.name}</span>
          </div>
        );
      })}

      {/* Clean Vercel-style Center HUD Percentage */}
      <div className="preloader-hud-center" ref={percentRef}>
        <div className="preloader-hud-sub">SWARM INITIALIZATION</div>
        <div className="preloader-hud-percent">
          {String(percent).padStart(3, "0")}
          <span className="percent-symbol">%</span>
        </div>
        <div className="preloader-progress-track">
          <div className="preloader-progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>

      {/* Outro Transition Panels */}
      <div className="outro-panel panel-left"></div>
      <div className="outro-panel panel-right"></div>
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

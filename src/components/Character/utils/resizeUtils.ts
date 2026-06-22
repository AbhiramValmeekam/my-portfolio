import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

let resizeTimer: ReturnType<typeof setTimeout> | null = null;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D,
  setIsLoading?: (state: boolean) => void,
  setLoading?: (percent: number) => void
) {
  // Immediate: update renderer size so canvas doesn't look stretched
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (setIsLoading && setLoading) {
    setIsLoading(true);
    setLoading(0);
  }

  // Debounce: let ScrollTrigger recalculate after resize settles.
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Kill existing ScrollTriggers to prevent duplicate triggers and conflicts
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Clear GSAP offsets while preserving raw CSS transforms (like translateX(-50%))
    gsap.set(".character-model", { clearProps: "x,y,pointerEvents" });
    gsap.set(
      [
        ".character-rim",
        ".about-me",
        ".landing-container",
        ".about-section",
        ".what-box-in",
        ".whatIDO",
        ".career-timeline",
        ".career-info-box",
      ],
      { clearProps: "all" }
    );

    // Reset character rotation/position to initial setup
    character.rotation.set(0, 0, 0);
    const initialCamera = [0, 13.1, 24.7];
    camera.position.set(initialCamera[0], initialCamera[1], initialCamera[2]);

    // Reinitialize the correct timelines for the new screen size/breakpoint
    setCharTimeline(character, camera);
    setAllTimeline();

    // Force a complete rebuild of ScrollTrigger values
    ScrollTrigger.refresh(true);

    if (setIsLoading && setLoading) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setLoading(100);
          // Keep it paused for a short second (1000ms) to let WebGL paint/render settle
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } else {
          setLoading(currentProgress);
        }
      }, 15);
    }
  }, 500);
}

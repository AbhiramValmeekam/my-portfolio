import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { portfolioConfig } from "../../../data/portfolioConfig";

let resizeTimer: ReturnType<typeof setTimeout> | null = null;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  // Debounce: only run after resize events settle (e.g. DevTools open/close)
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    performResize(renderer, camera, canvasDiv, character);
  }, 150);
}

function performResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Reset GSAP-applied values WITHOUT clearing CSS transforms.
  // GSAP's x/y are additive offsets; setting them to 0 preserves the
  // original CSS `transform: translateX(-50%)` that centers .character-model.
  gsap.set(".character-model", { x: 0, y: 0, pointerEvents: "inherit" });
  gsap.set(".character-rim", { opacity: 0, scale: 1.4, y: 0 });
  gsap.set(".about-me", { y: 0 });
  gsap.set(".landing-container", { opacity: 1, y: 0 });

  // Reset character rotation and camera to initial state
  character.rotation.set(0, 0, 0);
  const initialCamera = portfolioConfig.personalInfo.avatarConfig?.initialCamera || [0, 13.1, 24.7];
  camera.position.set(initialCamera[0], initialCamera[1], initialCamera[2]);

  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();

  // Force ScrollTrigger to recalculate positions based on current scroll
  ScrollTrigger.refresh();
}

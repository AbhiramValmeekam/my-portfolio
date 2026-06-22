import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { portfolioConfig } from "../../../data/portfolioConfig";

export default function handleResize(
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

  // Reset GSAP-applied inline transforms to prevent stale positions after resize
  gsap.set(".character-model", { clearProps: "x,y,pointerEvents" });
  gsap.set(".character-rim", { clearProps: "opacity,scale,scaleX,y" });
  gsap.set(".about-me", { clearProps: "y" });
  gsap.set(".landing-container", { clearProps: "opacity,y" });

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

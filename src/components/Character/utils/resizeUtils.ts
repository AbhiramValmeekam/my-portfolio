import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let resizeTimer: ReturnType<typeof setTimeout> | null = null;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  _character: THREE.Object3D
) {
  // Immediate: update renderer size so canvas doesn't look stretched
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Debounce: let ScrollTrigger recalculate after resize settles.
  // The timelines already have `invalidateOnRefresh: true`, so a refresh
  // is all that's needed — no killing/recreating of timelines.
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
}

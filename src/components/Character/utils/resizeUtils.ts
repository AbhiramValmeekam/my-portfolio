import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let resizeTimer: ReturnType<typeof setTimeout> | null = null;

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  _character: THREE.Object3D,
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

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { portfolioConfig } from "../../data/portfolioConfig";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    let isMounted = true;
    let animationFrameId: number;
    let debounce: number | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let landingDiv: HTMLElement | null = null;
    let onResize: (() => void) | undefined;
    let onMouseMove: ((event: MouseEvent) => void) | undefined;
    let onTouchStart: ((event: TouchEvent) => void) | undefined;
    let onTouchEnd: (() => void) | undefined;

    const initTimeout = setTimeout(() => {
      if (!isMounted || !canvasDiv.current) return;

      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        stencil: false,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      const initialCamera = portfolioConfig.personalInfo.avatarConfig?.initialCamera || [0, 13.1, 24.7];
      camera.position.set(initialCamera[0], initialCamera[1], initialCamera[2]);
      const initialZoom = portfolioConfig.personalInfo.avatarConfig?.initialZoom || 1.1;
      camera.zoom = initialZoom;
      camera.updateProjectionMatrix();

      (window as any)._scene = scene;
      (window as any)._camera = camera;
      (window as any)._renderer = renderer;

      let headBone: THREE.Object3D | null = null;
      let jawBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let isIntroRunning = () => false;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let loadedChar: THREE.Object3D | null = null;
      onResize = () => {
        if (renderer) {
          handleResize(renderer, camera, canvasDiv, loadedChar || new THREE.Object3D());
        }
      };
      window.addEventListener("resize", onResize);

      loadCharacter().then((gltf) => {
        if (!isMounted) return;
        if (gltf) {
          const animations = setAnimations(gltf);
          isIntroRunning = animations.isIntroRunning;
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          loadedChar = character;
          (window as any)._character = character;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || character.getObjectByName("Head") || null;
          jawBone = character.getObjectByName("jaw") || character.getObjectByName("Wolf3D_Jaw") || character.getObjectByName("Mouth") || character.getObjectByName("lower_jaw") || null;
          if (!jawBone) {
            character.traverse((child: any) => {
              if (child.name && child.name.toLowerCase().includes("jaw")) {
                jawBone = child;
              }
            });
          }
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            if (!isMounted) return;
            setTimeout(() => {
              if (!isMounted) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      
      onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      
      const animate = () => {
        if (!isMounted) return;
        animationFrameId = requestAnimationFrame(animate);
        if (headBone) {
          if (!isIntroRunning()) {
            handleHeadRotation(
              headBone,
              mouse.x,
              mouse.y,
              interpolation.x,
              interpolation.y,
              THREE.MathUtils.lerp
            );
          }
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        if (jawBone) {
          jawBone.rotation.x = 0.35; // Keep mouth open by rotating the jaw bone downward
        }
        if (renderer) renderer.render(scene, camera);
      };
      animate();
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(debounce);
      sceneRef.current.clear();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (canvasDiv.current && renderer.domElement.parentNode === canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
      }
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      if (onMouseMove) {
        document.removeEventListener("mousemove", onMouseMove);
      }
      if (landingDiv) {
        if (onTouchStart) landingDiv.removeEventListener("touchstart", onTouchStart);
        if (onTouchEnd) landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

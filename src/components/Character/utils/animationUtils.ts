import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

// Fuzzy matcher helper to locate animation clips that may have suffixes (e.g. key1.007, typing.011)
const findClip = (
  animations: THREE.AnimationClip[] | undefined,
  name: string
): THREE.AnimationClip | null => {
  if (!animations) return null;
  const lowerName = name.toLowerCase();
  return (
    animations.find(
      (clip) =>
        clip.name === name ||
        clip.name.startsWith(name + ".") ||
        clip.name.toLowerCase().startsWith(lowerName)
    ) || null
  );
};

const setAnimations = (gltf: GLTF) => {
  let character = gltf.scene;
  let mixer = new THREE.AnimationMixer(character);
  const keyActions: THREE.AnimationAction[] = [];
  let typingAction: THREE.AnimationAction | null = null;
  let introRunning = false;

  if (gltf.animations) {
    const introClip = findClip(gltf.animations, "introAnimation");
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      // Do not play intro here; let startIntro control it after loader ends
    }
    const clipNames = ["key1", "key2", "key5", "key6"];
    clipNames.forEach((name) => {
      const clip = findClip(gltf.animations, name);
      if (clip) {
        const action = mixer?.clipAction(clip);
        if (action) {
          action.timeScale = 1.2;
          keyActions.push(action);
        }
      } else {
        console.error(`Animation "${name}" not found`);
      }
    });
    typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.timeScale = 1.2;
    }
  }
  function startIntro() {
    const introClip = findClip(gltf.animations, "introAnimation");
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.clampWhenFinished = true;
      introAction.reset().play();
      introRunning = true;

      // Ensure typing and key animations are stopped while intro runs
      if (typingAction) typingAction.stop();
      keyActions.forEach((action) => action.stop());

      const onIntroFinished = (e: any) => {
        if (e.action === introAction) {
          mixer.removeEventListener("finished", onIntroFinished);
          introRunning = false;
          if (typingAction) {
            typingAction.enabled = true;
            typingAction.play();
          }
          keyActions.forEach((action) => action.play());
        }
      };
      mixer.addEventListener("finished", onIntroFinished);
    } else {
      // No intro animation, start typing animations immediately
      introRunning = false;
      if (typingAction) {
        typingAction.enabled = true;
        typingAction.play();
      }
      keyActions.forEach((action) => action.play());
    }
    setTimeout(() => {
      const blink = findClip(gltf.animations, "Blink");
      if (blink) {
        const blinkAction = mixer.clipAction(blink);
        blinkAction.play().fadeIn(0.5);
      }
    }, 2500);
  }
  function hover(gltf: GLTF, hoverDiv: HTMLDivElement) {
    let eyeBrowUpAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };
    if (!hoverDiv) return;
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }
  return { mixer, startIntro, hover, isIntroRunning: () => introRunning };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const AnimationClip = findClip(gltf.animations, clip);
  if (!AnimationClip) {
    printAnimationMissingError(clip, gltf.animations);
    return null;
  }

  const filteredClip = filterAnimationTracks(AnimationClip, boneNames);

  return mixer.clipAction(filteredClip);
};

const printAnimationMissingError = (clip: string, animations: THREE.AnimationClip[]) => {
  console.error(
    `Animation "${clip}" not found in GLTF file. Available animations:`,
    animations.map((a) => a.name)
  );
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;

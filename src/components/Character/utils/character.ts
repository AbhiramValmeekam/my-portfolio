import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { portfolioConfig } from "../../../data/portfolioConfig";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const avatarUrl = portfolioConfig.personalInfo.avatarUrl || "/models/character.glb";
        const isEncrypted = avatarUrl.endsWith(".enc");

        let loadUrl = avatarUrl;
        if (isEncrypted) {
          const encryptedBlob = await decryptFile(avatarUrl, "Character3D#@");
          loadUrl = URL.createObjectURL(new Blob([encryptedBlob]));
        }

        // Helper to check if model is default base model
        const isBaseModel = avatarUrl === "/models/character.glb" || avatarUrl === "/models/character.enc" || avatarUrl === "/models/portfolio.glb";

        if (isBaseModel) {
          // If loading base model directly, just load it and return with a cache buster
          loader.load(
            loadUrl + "?v=" + Date.now(),
            async (gltf) => {
              const character = gltf.scene;
              await renderer.compileAsync(character, camera, scene);
              character.traverse((child: any) => {
                if (child.isMesh) {
                  const mesh = child as THREE.Mesh;
                  child.castShadow = true;
                  child.receiveShadow = true;
                  mesh.frustumCulled = true;
                }
              });
              resolve(gltf);
              setCharTimeline(character, camera);
              setAllTimeline();

              const footR = character.getObjectByName("foot.R") || character.getObjectByName("footR");
              if (footR) footR.position.y = 3.36;
              
              const footL = character.getObjectByName("foot.L") || character.getObjectByName("footL");
              if (footL) footL.position.y = 3.36;

              dracoLoader.dispose();
            },
            undefined,
            (error) => {
              console.error("Error loading GLTF model:", error);
              reject(error);
            }
          );
        } else {
          // Loading custom model: load character.glb as base for skeleton/animations, and load custom avatar
          loader.load(
            "/models/character.glb",
            async (baseGltf) => {
              const baseScene = baseGltf.scene;

              // Apply foot position adjustment to base skeleton first
              const footR = baseScene.getObjectByName("foot.R") || baseScene.getObjectByName("footR");
              if (footR) footR.position.y = 3.36;
              
              const footL = baseScene.getObjectByName("foot.L") || baseScene.getObjectByName("footL");
              if (footL) footL.position.y = 3.36;

              // Find skeleton in base character.glb
              let skeleton: any = null;
              baseScene.traverse((child: any) => {
                if (child.isMesh && child.skeleton) {
                  skeleton = child.skeleton;
                }
              });

              if (!skeleton) {
                console.error("No skeleton found in base model.");
                resolve(baseGltf);
                dracoLoader.dispose();
                return;
              }

              const skeletonParent = baseScene.getObjectByName("metarig.002") || skeleton.bones[0].parent || baseScene;

              // Hide original character body meshes in base model (any descendant of skeletonParent), keeping environment
              baseScene.traverse((child: any) => {
                if (child.isMesh) {
                  let parent = child.parent;
                  let isCharacterMesh = false;
                  while (parent) {
                    if (parent === skeletonParent) {
                      isCharacterMesh = true;
                      break;
                    }
                    parent = parent.parent;
                  }
                  if (isCharacterMesh) {
                    child.visible = false;
                  }
                }
              });

              // Load the custom avatar GLB
              loader.load(
                loadUrl,
                async (avatarGltf) => {
                  const avatarScene = avatarGltf.scene;

                  // Get all bones world positions in default rest pose
                  const bones = skeleton!.bones;
                  // Force world matrix update so world positions are correct
                  baseScene.updateMatrixWorld(true);

                  // Define list of main body bones to restrict skinning and avoid finger stretching
                  const mainBoneKeywords = ["spine", "shoulder", "upper_arm", "forearm", "hand", "thigh", "shin", "foot"];
                  const isMainBone = (name: string) => {
                    const n = name.toLowerCase();
                    // Exclude detailed finger, toe, breast, and pelvis helper joints
                    if (n.includes("palm") || n.includes("thumb") || n.includes("pinky") || n.includes("ring") || 
                        n.includes("middle") || n.includes("index") || n.includes("toe") || n.includes("heel") || 
                        n.includes("breast") || n.includes("pelvis")) {
                      return false;
                    }
                    return mainBoneKeywords.some(keyword => n.includes(keyword));
                  };

                  // Filter the bones list for distance calculations but keep original skeleton indices
                  const filteredBonesInfo = bones.map((bone: any, idx: number) => ({ bone, originalIndex: idx }))
                                                .filter((item: any) => isMainBone(item.bone.name));

                  const boneLocalPositions = filteredBonesInfo.map((item: any) => {
                    const pos = new THREE.Vector3();
                    item.bone.getWorldPosition(pos);
                    skeletonParent.worldToLocal(pos);
                    return {
                      position: pos,
                      originalIndex: item.originalIndex
                    };
                  });

                  // Calculate height bounding box of skeleton bones in skeletonParent's local space
                  let minBoneY = Infinity;
                  let maxBoneY = -Infinity;
                  boneLocalPositions.forEach((info: any) => {
                    if (info.position.y < minBoneY) minBoneY = info.position.y;
                    if (info.position.y > maxBoneY) maxBoneY = info.position.y;
                  });
                  const skeletonHeight = maxBoneY - minBoneY;

                  // Find meshes in custom avatar to rig them
                  const avatarMeshes: THREE.Mesh[] = [];
                  avatarScene.traverse((child: any) => {
                    if (child.isMesh) {
                      avatarMeshes.push(child);
                    }
                  });

                  const config = portfolioConfig.personalInfo.avatarConfig;
                  const userScale = config?.scale ?? 1;
                  const userPosOffset = config?.position ?? [0, 0, 0];

                  avatarMeshes.forEach((mesh) => {
                    // Compute bounding box of custom mesh
                    mesh.geometry.computeBoundingBox();
                    const meshBox = mesh.geometry.boundingBox!;
                    const meshSize = new THREE.Vector3();
                    meshBox.getSize(meshSize);

                    // Scale to match skeleton height in skeletonParent local space
                    const scaleFactor = (skeletonHeight / meshSize.y) * userScale;
                    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    // Align bottom of mesh with bottom of skeleton in skeletonParent local space
                    const meshBottom = meshBox.min.y * scaleFactor;
                    const skeletonBottom = minBoneY;
                    const yOffset = skeletonBottom - meshBottom + userPosOffset[1];
                    mesh.position.set(userPosOffset[0], yOffset, userPosOffset[2]);
                    mesh.updateMatrix();

                    // Clone geometry and bake local position transformations (relative to skeletonParent)
                    const geometry = mesh.geometry.clone();
                    geometry.applyMatrix4(mesh.matrix);

                    // Recalculate vertex normals to ensure smooth shading
                    geometry.computeVertexNormals();

                    // Set up skinIndices and skinWeights attributes for geometry
                    const positionAttr = geometry.attributes.position;
                    const vertexCount = positionAttr.count;
                    const skinIndices: number[] = [];
                    const skinWeights: number[] = [];
                    const tempVertex = new THREE.Vector3();

                    for (let i = 0; i < vertexCount; i++) {
                      tempVertex.fromBufferAttribute(positionAttr, i);

                      // Distance to filtered main bones in local space
                      const distances = boneLocalPositions.map((boneInfo: any) => ({
                        index: boneInfo.originalIndex,
                        distance: tempVertex.distanceTo(boneInfo.position)
                      }));

                      // Sort by distance ascending
                      distances.sort((a: any, b: any) => a.distance - b.distance);

                      // Assign closest 4 bones
                      const indices: number[] = [];
                      const weights: number[] = [];
                      let weightSum = 0;

                      for (let j = 0; j < 4; j++) {
                        indices.push(distances[j].index);
                        const d = Math.max(distances[j].distance, 0.0001);
                        const w = 1.0 / (d * d);
                        weights.push(w);
                        weightSum += w;
                      }

                      // Normalize weights
                      for (let j = 0; j < 4; j++) {
                        weights[j] /= weightSum;
                      }

                      skinIndices.push(...indices);
                      skinWeights.push(...weights);
                    }

                    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
                    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

                    // Optimize StandardMaterial parameters for natural matte look
                    if (mesh.material) {
                      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                      mats.forEach((mat: any) => {
                        if (mat.isMeshStandardMaterial) {
                          mat.roughness = Math.max(mat.roughness, 0.7); // Smooth matte shading
                          mat.metalness = Math.min(mat.metalness, 0.0); // Non-metallic skin/clothes
                        }
                      });
                    }

                    // Create SkinnedMesh, parent it to skeletonParent so it shares local coordinate space
                    const skinnedMesh = new THREE.SkinnedMesh(geometry, mesh.material);
                    skinnedMesh.position.set(0, 0, 0);
                    skinnedMesh.rotation.set(0, 0, 0);
                    skinnedMesh.scale.set(1, 1, 1);
                    skinnedMesh.castShadow = true;
                    skinnedMesh.receiveShadow = true;
                    skinnedMesh.frustumCulled = true;

                    skeletonParent.add(skinnedMesh);
                    skinnedMesh.bind(skeleton!);
                  });

                  await renderer.compileAsync(baseScene, camera, scene);
                  resolve(baseGltf);
                  setCharTimeline(baseScene, camera);
                  setAllTimeline();
                  dracoLoader.dispose();
                },
                undefined,
                (error) => {
                  console.error("Error loading custom avatar GLTF model:", error);
                  reject(error);
                }
              );
            },
            undefined,
            (error) => {
              console.error("Error loading base model:", error);
              reject(error);
            }
          );
        }
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;

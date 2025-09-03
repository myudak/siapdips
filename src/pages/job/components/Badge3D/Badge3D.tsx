import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit2, X, Save, RotateCcw } from "lucide-react";
import { ImageCropper } from "@/pages/option/components/Settings/Settingcard.profile.lib";

extend({ MeshLineGeometry, MeshLineMaterial });

// Default images
const DEFAULT_FRONT_IMAGE = "./images/profile.webp";
const DEFAULT_BACK_IMAGE =
  "https://placehold.co/400x600/09090b/ffffff?text=Back+Badge";
const BAND_TEXTURE_URL = "./images/band.png";

export default function Badge3D({
  scale = 1.5,
  debug = false,
  cardAspectRatio = 1.6 / 2.25,
  baseCardHeight = 2.25,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [frontImage, setFrontImage] = useState(DEFAULT_FRONT_IMAGE);
  const [backImage, setBackImage] = useState(DEFAULT_BACK_IMAGE);
  const [tempFrontImage, setTempFrontImage] = useState(frontImage);
  const [tempBackImage, setTempBackImage] = useState(backImage);

  useEffect(() => {
    // Load images from local storage if available
    chrome.storage.local.get(["frontImage", "backImage"], (result) => {
      if (result.frontImage) {
        setFrontImage(result.frontImage);
        setTempFrontImage(result.frontImage);
      }
      if (result.backImage) {
        setBackImage(result.backImage);
        setTempBackImage(result.backImage);
      }
    });
  }, []);

  const handleSave = () => {
    setFrontImage(tempFrontImage);
    setBackImage(tempBackImage);

    chrome.storage.local.set({
      frontImage: tempFrontImage,
      backImage: tempBackImage,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempFrontImage(frontImage);
    setTempBackImage(backImage);
    setIsEditing(false);
  };

  const handleReset = () => {
    setTempFrontImage(DEFAULT_FRONT_IMAGE);
    setTempBackImage(DEFAULT_BACK_IMAGE);
  };

  return (
    <div className="w-full h-full min-h-[300px] group relative">
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics
          debug={debug}
          interpolate
          gravity={[0, -40, 0]}
          timeStep={1 / 60}
        >
          <Band
            scale={scale}
            cardAspectRatio={cardAspectRatio}
            baseCardHeight={baseCardHeight}
            frontImageUrl={isEditing ? tempFrontImage : frontImage}
            backImageUrl={isEditing ? tempBackImage : backImage}
          />
        </Physics>
      </Canvas>

      {/* Edit Button with Dialog */}
      <div className="absolute top-4 left-4 z-10 group-hover:opacity-100 opacity-0 pointer-events-none transition group-hover:pointer-events-auto">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Badge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Badge</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
              {/* Preview Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
                    <ambientLight intensity={Math.PI} />
                    <Physics
                      debug={false}
                      interpolate
                      gravity={[0, -40, 0]}
                      timeStep={1 / 60}
                    >
                      <Band
                        scale={0.8}
                        cardAspectRatio={cardAspectRatio}
                        baseCardHeight={baseCardHeight}
                        frontImageUrl={tempFrontImage}
                        backImageUrl={tempBackImage}
                      />
                    </Physics>
                  </Canvas>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Badge Images</h3>

                {/* Front Image */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Front Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-36 bg-gray-100 rounded border overflow-hidden">
                      <img
                        src={tempFrontImage}
                        alt="Front preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <ImageCropper
                        onCropComplete={(croppedImageData) => {
                          setTempFrontImage(croppedImageData);
                        }}
                        aspectRatio={1 / 1.586}
                        triggerButton={
                          <Button type="button" variant="outline" size="sm">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Change Front
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Back Image */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Back Image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-36 bg-gray-100 rounded border overflow-hidden">
                      <img
                        src={tempBackImage}
                        alt="Back preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <ImageCropper
                        onCropComplete={(croppedImageData) => {
                          setTempBackImage(croppedImageData);
                        }}
                        aspectRatio={1 / 1.586}
                        triggerButton={
                          <Button type="button" variant="outline" size="sm">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Change Back
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Professional Badge Clip Component
function BadgeClip({ scale = 1, position = [0, 0, 0] }) {
  const clipGroup = useRef();

  return (
    <group ref={clipGroup} position={position}>
      {/* Main clip body - oval shaped */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.08 * scale, 0.25 * scale, 4, 8]} />
        <meshPhysicalMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Clip spring mechanism */}
      <mesh position={[0, -0.12 * scale, 0]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.03 * scale, 0.15 * scale, 0.08 * scale]} />
        <meshPhysicalMaterial
          color="#a0a0a0"
          metalness={0.9}
          roughness={0.15}
          clearcoat={0.8}
        />
      </mesh>

      {/* Top ring for lanyard attachment */}
      <mesh position={[0, 0.18 * scale, 0]}>
        <torusGeometry args={[0.12 * scale, 0.04 * scale, 8, 16]} />
        <meshPhysicalMaterial
          color="#b8b8b8"
          metalness={0.95}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* Decorative ridges on the clip body */}
      {[0.06, 0.02, -0.02, -0.06].map((yOffset, index) => (
        <mesh key={index} position={[0, yOffset * scale, 0.085 * scale]}>
          <boxGeometry args={[0.15 * scale, 0.015 * scale, 0.008 * scale]} />
          <meshPhysicalMaterial
            color="#d0d0d0"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Brand marking/logo area */}
      <mesh position={[0, -0.05 * scale, 0.089 * scale]}>
        <boxGeometry args={[0.08 * scale, 0.06 * scale, 0.001 * scale]} />
        <meshPhysicalMaterial color="#909090" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  scale = 1,
  cardAspectRatio = 1.6 / 2.25,
  baseCardHeight = 2.25,
  frontImageUrl = DEFAULT_FRONT_IMAGE,
  backImageUrl = DEFAULT_BACK_IMAGE,
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  // Load textures
  const [frontTexture, backTexture, bandTexture] = useTexture([
    frontImageUrl,
    backImageUrl,
    BAND_TEXTURE_URL,
  ]);

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // Calculate responsive card dimensions
  const cardHeight = baseCardHeight * scale;
  const cardWidth = cardHeight * cardAspectRatio;
  const cardThickness = 0.02 * scale;

  // Scale rope joint distances
  const ropeDistance = 1 * scale;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeDistance]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeDistance]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeDistance]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, cardHeight * 0.64, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  // Scale positions proportionally
  const segmentSpacing = 0.5 * scale;
  const yPosition = 4 * scale;

  return (
    <>
      <group position={[0, yPosition, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[segmentSpacing, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1 * scale]} />
        </RigidBody>
        <RigidBody
          position={[segmentSpacing * 2, 0, 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1 * scale]} />
        </RigidBody>
        <RigidBody
          position={[segmentSpacing * 3, 0, 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1 * scale]} />
        </RigidBody>
        <RigidBody
          position={[segmentSpacing * 4, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider
            args={[cardWidth / 2, cardHeight / 2, cardThickness / 2]}
          />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
            {/* Card body with rounded corners */}
            <mesh>
              <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
              <meshPhysicalMaterial
                color="#1a1a1a"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>

            {/* Front face */}
            <mesh position={[0, 0, cardThickness / 2 + 0.001]}>
              <planeGeometry args={[cardWidth, cardHeight]} />
              <meshPhysicalMaterial
                map={frontTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>

            {/* Back face */}
            <mesh
              position={[0, 0, -cardThickness / 2 - 0.001]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[cardWidth, cardHeight]} />
              <meshPhysicalMaterial
                map={backTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>

            {/* Professional Badge Clip */}
            <BadgeClip
              scale={scale}
              position={[0, cardHeight / 2 - 0.1 * scale, 0]}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={bandTexture}
          repeat={[-3, 1]}
          lineWidth={1 * scale}
        />
      </mesh>
    </>
  );
}

import { Sphere, Cylinder } from "@react-three/drei";

export default function RoundBottomFlask3D({
  position = [0, 0, 0],
  liquidColor = null,
  liquidLevel = 0.5,
  tilt = false
}) {
  return (
    <group
      position={position}
      rotation={tilt ? [0, 0, -0.35] : [0, 0, 0]}
    >
      {/* ===== GLASS BULB ===== */}
      <Sphere args={[1, 48, 48]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.85}          // 👈 more visible
          roughness={0.05}
          metalness={0}
          transmission={0.95}    // 👈 not full transmission
          thickness={0.6}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.2}
        />
      </Sphere>

      {/* ===== NECK ===== */}
      <Cylinder args={[0.3, 0.3, 1.6, 32]} position={[0, 1.3, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.85}
          roughness={0.05}
          transmission={0.75}
          thickness={0.4}
          clearcoat={1}
        />
      </Cylinder>

      {/* ===== LIQUID ===== */}
      {liquidColor && (
        <>
          {/* Main liquid volume */}
          <Sphere
            args={[0.85, 32, 32]}
            scale={[1, liquidLevel, 1]}
            position={[0, -0.6 + liquidLevel * 0.3, 0]}
          >
            <meshStandardMaterial
              color={liquidColor}
              transparent
              opacity={0.95}      // 👈 strong visibility
              roughness={0.15}
              metalness={0}
            />
          </Sphere>

          {/* Liquid surface (flat cut) */}
          <Cylinder
            args={[0.85, 0.85, 0.02, 32]}
            position={[0, -0.6 + liquidLevel * 0.6, 0]}
          >
            <meshStandardMaterial
              color={liquidColor}
              opacity={0.2}
            />
          </Cylinder>
        </>
      )}
    </group>
  );
}

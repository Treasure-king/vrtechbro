# Phase 8: 🧊 3D Integration & Interactive Experiences

> **Goal:** Design and build the custom 3D scene(s) in Blender, implement them with Three.js/R3F, add scroll-based and mouse-based interactions, and ensure graceful degradation on low-power devices.
>
> **Estimated Tasks:** 10
> **Depends On:** Phase 7 (Page Redesign). **Run after Phase 9** — the portfolio delivers more value sooner, and the 3D hero needs a finished Blender asset.

---

## Refinements (2026-10-15)

- **Asset sourcing:** image models (Gemini etc.) cannot produce `.glb` files. The model must come from Blender (preferred), or a CC0/CC-BY model from Sketchfab/Poly Pizza restyled in Blender. Gemini can still produce texture art (e.g. the monitor screen texture).
- **Bundle:** load the scene with `next/dynamic(() => import(...), { ssr: false })` and only after the hero is visible/idle, so Three.js never blocks LCP. The static hero image (Task 8.9) is the LCP element.
- **CSP:** the current CSP blocks third-party fetches. Self-host the Draco/Meshopt decoders under `public/draco/` (drei defaults to a gstatic CDN) and add `worker-src 'self' blob:` to `next.config.ts` if a decoder uses workers.
- **Motion:** disable scroll-driven assembly and mouse parallax when `prefers-reduced-motion` is set; render the assembled final state instead.

---

## Pre-Phase: Reinstall 3D Dependencies

These were removed in Phase 1 (Task 1.13). Now they're needed:

```bash
npm install three @react-three/fiber @react-three/drei @types/three
```

---

## Task 8.1 — Design "The Forge" 3D Model in Blender

### Concept
A stylized developer workstation that assembles itself as the user scrolls. Elements include:
- **Monitor** with code editor on screen (texture)
- **Keyboard** with subtle glow keys
- **Mouse** 
- **Coffee mug** with steam particle effect
- **Floating UI cards** around the monitor (representing different skills)
- **Desk/surface** — minimal, modern

### Blender Guidelines
1. **Style:** Low-poly stylized (not photorealistic) — think Abstract 3D illustrations
2. **Polycount:** Keep under 50K faces total for web performance
3. **Materials:** Use simple PBR materials with emissive elements (no complex shaders)
4. **Separate meshes:** Each element should be a separate object for individual animation
5. **Export format:** `.glb` (compressed binary GLTF)
6. **Target file size:** < 2MB after compression
7. **Texture resolution:** Max 1024x1024 per texture
8. **UV unwrapping:** Required for any textured elements

### Deliverable
- `public/models/the-forge.glb` — optimized model file
- Each mesh named: `monitor`, `keyboard`, `mouse`, `mug`, `desk`, `card_1`, `card_2`, etc.

### Verification
- [ ] Model opens correctly in Three.js model viewer
- [ ] File size < 2MB
- [ ] All meshes are separate and named
- [ ] Visual style matches the site's dark, premium aesthetic

---

## Task 8.2 — Build Three.js/R3F Scene Container

### Implementation

```tsx
// components/hero-scene.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, Preload } from '@react-three/drei'

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}  // Limit DPR for performance
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          {/* <ForgeModel /> */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

### Key Decisions
- `alpha: true` — transparent background so site content shows through
- `dpr: [1, 2]` — cap device pixel ratio for performance
- `Suspense` with fallback for loading state
- Dynamic import the Canvas to prevent SSR issues:
  ```tsx
  const HeroScene = dynamic(() => import('@/components/hero-scene'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-bg-primary" />,
  })
  ```

### Verification
- [ ] Canvas renders without errors
- [ ] Background is transparent
- [ ] No SSR hydration errors

---

## Task 8.3 — Load and Display the 3D Model

### Implementation

```tsx
// components/forge-model.tsx
'use client'

import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'

export function ForgeModel() {
  const { scene } = useGLTF('/models/the-forge.glb')
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/the-forge.glb')
```

### Verification
- [ ] Model loads and displays in the scene
- [ ] Scale and position look correct
- [ ] No console errors about missing textures

---

## Task 8.4 — Implement Scroll-Based Assembly Animation

### Concept
As the user scrolls from 0% to 100% of the hero viewport, model elements fly in from different directions and assemble into the final workstation.

### Implementation
1. Use `useScroll` from `@react-three/drei` or a custom scroll handler
2. Map scroll progress (0 → 1) to animation progress
3. Each mesh has an individual animation curve:
   - Monitor: Drops from above (y: 10 → 0)
   - Keyboard: Slides from left (x: -5 → 0)
   - Mouse: Slides from right (x: 5 → 0)
   - Mug: Rises from below (y: -3 → 0)
   - Cards: Float in from various directions with slight rotation

```tsx
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

function AnimatedMesh({ mesh, startProgress, endProgress, fromPosition }) {
  const scroll = useScroll()

  useFrame(() => {
    const progress = MathUtils.clamp(
      (scroll.offset - startProgress) / (endProgress - startProgress),
      0, 1
    )

    mesh.position.lerp(
      { x: fromPosition.x * (1 - progress), y: fromPosition.y * (1 - progress), z: fromPosition.z * (1 - progress) },
      0.1
    )
    mesh.material.opacity = progress
  })
}
```

### Verification
- [ ] Scrolling makes pieces assemble smoothly
- [ ] Animation is smooth at 60fps
- [ ] Full assembly visible by ~80% scroll
- [ ] No janky jumps or stutters

---

## Task 8.5 — Add Mouse Interaction

### Concept
The assembled model subtly rotates/tilts based on mouse position, creating a parallax-like depth effect.

### Implementation
```tsx
import { useFrame, useThree } from '@react-three/fiber'

function MouseTracker({ groupRef }) {
  const { pointer } = useThree()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.3,
        0.05
      )
      groupRef.current.rotation.x = MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.15,
        0.05
      )
    }
  })
}
```

### Verification
- [ ] Model responds to mouse movement
- [ ] Movement is smooth (lerped, not jerky)
- [ ] Rotation range is subtle (not disorienting)

---

## Task 8.6 — Add Post-Processing Effects (Optional)

### Effects to Consider
- **Bloom:** Subtle glow on emissive elements (monitor screen, key backlights)
- **Ambient Occlusion:** Depth and realism at contact points
- **Vignette:** Darken edges of the 3D scene

```tsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom luminanceThreshold={0.8} intensity={0.5} />
  <Vignette eskil={false} offset={0.1} darkness={0.5} />
</EffectComposer>
```

> **Warning:** Post-processing is GPU-intensive. Only enable on capable devices.

### Verification
- [ ] Effects enhance the scene without hurting performance
- [ ] Disabled on low-power devices

---

## Task 8.7 — Build Skills Constellation (Tech Section)

### Concept
For the tech stack section, a particle/node system where each node is a technology and edges connect related technologies.

### Implementation
- Use instanced meshes for performance (hundreds of particles, one draw call)
- Each node is a small sphere with a label
- Edges are thin lines connecting related techs
- Mouse proximity attracts nearby nodes
- Subtle floating/breathing animation

### Can Be Pure Three.js
No Blender model needed — procedurally generated:
```tsx
function SkillNode({ position, label, color }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Html center>
        <span className="text-xs text-white/80 font-mono">{label}</span>
      </Html>
    </group>
  )
}
```

### Verification
- [ ] Constellation renders with all tech labels
- [ ] Mouse interaction works
- [ ] Performance stays above 30fps on mid-range devices

---

## Task 8.8 — Performance Optimization for 3D

### Strategies
1. **LOD (Level of Detail):** Reduce model complexity at distance
2. **Conditional rendering:** Only render 3D when in viewport
3. **Device detection:** Use `navigator.hardwareConcurrency` and `gl.getParameter(gl.MAX_TEXTURE_SIZE)` to detect GPU capability
4. **Progressive loading:** Show fallback image first, load 3D scene async
5. **Frame rate monitoring:** Drop effects if FPS < 30

```tsx
function useDeviceCapability() {
  const [canRender3D, setCanRender3D] = useState(true)

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 2
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    if (cores < 4 && isMobile) {
      setCanRender3D(false)
    }
  }, [])

  return canRender3D
}
```

### Verification
- [ ] 3D scene runs at 60fps on desktop
- [ ] 3D scene runs at 30+ fps on mid-range mobile
- [ ] Low-power devices see a static fallback image
- [ ] No GPU memory leaks

---

## Task 8.9 — Create Static Fallback for Non-3D Devices

### Implementation
A high-quality rendered image of "The Forge" scene (exported from Blender) displayed when:
- WebGL is not supported
- Device is low-power
- User has `prefers-reduced-motion`

```tsx
function HeroVisual() {
  const canRender3D = useDeviceCapability()

  if (!canRender3D) {
    return (
      <Image
        src="/images/forge-fallback.webp"
        alt="Developer workstation"
        fill
        className="object-cover opacity-60"
        priority
      />
    )
  }

  return <HeroScene />
}
```

### Verification
- [ ] Fallback image exists and looks great
- [ ] Displayed correctly when 3D is disabled
- [ ] `prefers-reduced-motion` triggers fallback

---

## Task 8.10 — Integration Testing & Polish

### Checklist
- [ ] 3D scene works on Chrome, Firefox, Safari, Edge
- [ ] Mobile touch interactions work (touch → mouse mapping)
- [ ] Scene cleans up properly on unmount (no memory leaks)
- [ ] Loading state is smooth (no flash of unstyled content)
- [ ] Scroll animations sync perfectly with page scroll
- [ ] 3D scene doesn't interfere with text readability
- [ ] Text overlay on top of 3D scene has proper contrast
- [ ] Accessibility: 3D is decorative, not content-critical

---

## Phase 8 — Final Verification Checklist

- [ ] Custom "Forge" 3D model renders in hero section
- [ ] Scroll-based assembly animation works smoothly
- [ ] Mouse interaction creates parallax effect
- [ ] Skills constellation renders in tech section
- [ ] Performance: 60fps desktop, 30fps mobile
- [ ] Fallback image for non-capable devices
- [ ] `prefers-reduced-motion` respected
- [ ] No memory leaks
- [ ] Cross-browser compatible
- [ ] `npm run build` succeeds

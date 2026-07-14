"use client";

// Animated 3D "map field" — a perspective grid of points with glowing amber
// nodes (the Experience Centers) that pulse and undulate. Pure three.js, no R3F.
// Client-only (dynamic ssr:false). Wave + pulse run in-shader for performance.
// Honors prefers-reduced-motion (renders one static frame, no rAF loop).

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MapField3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 120);
    camera.position.set(0, 7.5, 15);
    camera.lookAt(0, -0.5, -2);

    // WebGL may not be available — degrade gracefully instead of crashing the page
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      // No WebGL — leave the mount empty (dark bg shows through)
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    // ── Build the point grid ──
    const GX = 64;
    const GZ = 64;
    const SP = 0.46;
    const count = GX * GZ;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phase = new Float32Array(count);
    const center = new Float32Array(count);

    const dim = new THREE.Color("#7a5024");
    const amber = new THREE.Color("#cd872a");
    const centerIdx = new Set<number>();
    while (centerIdx.size < 34) centerIdx.add(Math.floor(Math.random() * count));

    let i = 0;
    for (let x = 0; x < GX; x++) {
      for (let z = 0; z < GZ; z++) {
        const ix = i * 3;
        positions[ix] = (x - GX / 2) * SP;
        positions[ix + 1] = 0;
        positions[ix + 2] = (z - GZ / 2) * SP;
        const isCenter = centerIdx.has(i);
        const c = isCenter ? amber : dim;
        colors[ix] = c.r;
        colors[ix + 1] = c.g;
        colors[ix + 2] = c.b;
        sizes[i] = isCenter ? 6.5 : 2.0;
        phase[i] = Math.random() * Math.PI * 2;
        center[i] = isCenter ? 1 : 0;
        i++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    geo.setAttribute("aCenter", new THREE.BufferAttribute(center, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        attribute float aCenter;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = aColor;
          vec3 p = position;
          p.y += sin(uTime * 0.8 + aPhase + p.x * 0.16 + p.z * 0.16) * 0.55;
          float pulse = aCenter > 0.5 ? (1.0 + 0.45 * sin(uTime * 2.0 + aPhase)) : 1.0;
          vAlpha = aCenter > 0.5 ? (0.65 + 0.35 * sin(uTime * 2.0 + aPhase)) : 0.45;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * pulse * (62.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });

    const points = new THREE.Points(geo, material);
    const group = new THREE.Group();
    group.add(points);
    group.rotation.x = -0.12;
    scene.add(group);

    let raf = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      group.rotation.y = Math.sin(t * 0.05) * 0.25 + t * 0.015;
      renderer.render(scene, camera);
    };
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) render();
    else loop();

    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (reduce) render();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    const io = new IntersectionObserver(
      (entries) => {
        if (reduce) return;
        const visible = entries[0]?.isIntersecting;
        if (visible && raf === 0) loop();
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(mount);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

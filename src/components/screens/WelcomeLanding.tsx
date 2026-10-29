import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Rocket, Radio, Activity, Globe, Compass, Sparkles } from 'lucide-react';

const SpaceCanvas = ({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const starCount = 2500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      starSpeeds[i] = 0.05 + Math.random() * 0.1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const planetGeo = new THREE.SphereGeometry(8, 64, 64);
    const planetMat = new THREE.MeshPhongMaterial({ color: 0xd34836, emissive: 0x3d0b05, specular: 0xff6644, shininess: 25 });
    const mainPlanet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(mainPlanet);

    const atmosphereGeo = new THREE.SphereGeometry(8.4, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.15, side: THREE.BackSide });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    planetGroup.add(atmosphere);

    const ringGeo = new THREE.RingGeometry(11, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.25, wireframe: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    planetGroup.add(ring);

    scene.add(new THREE.AmbientLight(0x222233, 1.5));
    const dirLight = new THREE.DirectionalLight(0xff7744, 2.5);
    dirLight.position.set(30, 20, 20);
    scene.add(dirLight);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mainPlanet.rotation.y = elapsedTime * 0.12;
      ring.rotation.z = elapsedTime * 0.05;

      const positions = starGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += starSpeeds[i];
        if (positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -150;
      }
      starGeometry.attributes.position.needsUpdate = true;

      planetGroup.position.x += (mousePos.current.x * 4 - planetGroup.position.x) * 0.03;
      planetGroup.position.y += (-mousePos.current.y * 4 - planetGroup.position.y) * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [mousePos]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export const WelcomeLanding: React.FC = () => {
    console.log("NASA API Key Check:", import.meta.env.VITE_NASA_API_KEY);
  const navigate = useNavigate();
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    };
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-[#020205] text-white font-sans select-none flex flex-col justify-between p-4 md:p-6"
    >
      <SpaceCanvas mousePos={mousePos} />

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Bar HUD */}
      <header className="relative z-20 w-full flex justify-between items-center text-xs tracking-widest text-gray-300 border-b border-white/10 pb-3 backdrop-blur-md px-3 rounded-lg bg-black/20 font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> DSN NETWORK: ONLINE
          </span>
        </div>

        <div className="hidden lg:flex gap-8 text-[11px] uppercase text-gray-400 tracking-widest font-mono">
          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-red-400" /> LATENCY: <strong className="text-white">1.2s</strong></span>
          <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-orange-400" /> SATELLITES: <strong className="text-white">11 ACTIVE</strong></span>
          <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-emerald-400" /> ORBITAL VELOCITY: <strong className="text-white">7.66 KM/S</strong></span>
        </div>
      </header>

      {/* Main Title & Enter Button */}
      <main className="relative z-10 w-full h-full flex flex-col justify-between items-center py-4">
        <div className="flex flex-col items-center mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-widest mb-3 backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-600 drop-shadow-[0_0_50px_rgba(239,68,68,0.8)] animate-[zoomFocus_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            MISSION FORGE
          </h1>

          <p className="mt-2 text-[#00ff66] text-xs sm:text-sm md:text-base font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-center drop-shadow-[0_0_15px_rgba(0,255,102,0.8)] max-w-2xl px-4">
            NASA SPACE APPS CHALLENGE SIMULATION PLATFORM
          </p>
        </div>

        {/* ENTER WELCOME PORTAL BUTTON */}
        <div className="mb-6 z-20">
          <button
            onClick={() => navigate('/signup')}
            className="group relative px-9 sm:px-11 py-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-emerald-100 font-black text-base sm:text-lg rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.7)] hover:shadow-[0_0_60px_rgba(16,185,129,1)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-emerald-400/80 cursor-pointer overflow-hidden backdrop-blur-md animate-[btnPulse_2.5s_infinite]"
          >
            <div className="absolute inset-0 w-full h-full bg-emerald-300/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 tracking-widest flex items-center gap-3 font-mono text-emerald-100 group-hover:text-white drop-shadow-[0_0_8px_rgba(0,255,150,0.8)]">
              <Rocket className="w-5 h-5 text-yellow-300 group-hover:translate-x-1 transition-transform animate-bounce drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              ENTER WELCOME PORTAL
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-widest text-gray-400 border-t border-white/10 pt-3 backdrop-blur-md px-3 rounded-lg bg-black/20 font-mono">
        <span>POWERED BY <strong className="text-red-400 font-bold">NASA SPACE APPS CHALLENGE</strong></span>
        <span>DEVELOPED BY <strong className="text-white font-bold">TEAM ASTRONOVA</strong></span>
      </footer>

      <style>{`
        @keyframes zoomFocus {
          0% { transform: scale(0.3) translateY(-20px); opacity: 0; filter: blur(20px); }
          70% { transform: scale(1.04) translateY(3px); opacity: 0.9; filter: blur(0px); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.6); }
          50% { box-shadow: 0 0 50px rgba(0, 255, 204, 0.95); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeLanding;

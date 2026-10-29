import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMission } from '../../context/MissionContext';

export function SignUp() {
  const [authMode, setAuthMode] = useState<'selection' | 'register' | 'signin'>('selection');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showMissionStart, setShowMissionStart] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { login } = useAuth ? useAuth() : { login: null };
  const { setStep, setMissionName } = useMission();
  const navigate = useNavigate();

  // Dynamic High-Speed Hyperspace Starfield Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 2 + 0.8,
      color: Math.random() > 0.3 ? '#00ff88' : Math.random() > 0.5 ? '#ff3344' : '#22d3ee'
    }));

    const render = () => {
      ctx.fillStyle = '#020205';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const speed = showMissionStart ? 18.0 : 2.2;

      stars.forEach((star) => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 400 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const sz = Math.max(0.2, star.size * k * 0.9);
          const alpha = Math.min(1, (1 - star.z / width) * 2);

          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fill();

          const streakFactor = showMissionStart ? 0.35 : 0.08;
          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = sz * (showMissionStart ? 1.2 : 0.6);
          ctx.moveTo(px, py);
          ctx.lineTo(px + (px - cx) * streakFactor, py + (py - cy) * streakFactor);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showMissionStart]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || (authMode === 'register' && !email.trim())) {
      setErrorMsg('ALL FIELDS ARE REQUIRED FOR COMMAND INITIALIZATION.');
      return;
    }
    setErrorMsg('');

    if (name.trim()) {
      setMissionName(`${name.toUpperCase()}'S FORGE`);
    }

    setShowMissionStart(true);
  };

  const handleLaunch = () => {
    if (login) login();
    setStep('hangar');
    navigate('/mission');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#020205] select-none font-sans">

      {authMode !== 'selection' && !showMissionStart && (
        <button
          onClick={() => {
            setAuthMode('selection');
            setErrorMsg('');
          }}
          className="absolute top-6 left-6 z-30 px-4 py-2 bg-black/70 backdrop-blur-md border border-[#00ff88]/50 text-[#00ff88] hover:bg-[#00ff88]/20 hover:scale-105 active:scale-95 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(0,255,136,0.3)] cursor-pointer flex items-center gap-2"
        >
          <span>◀</span> BACK
        </button>
      )}

      {authMode === 'selection' && (
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 z-30 px-4 py-2 bg-black/70 backdrop-blur-md border border-[#00ff88]/50 text-[#00ff88] hover:bg-[#00ff88]/20 hover:scale-105 active:scale-95 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(0,255,136,0.3)] cursor-pointer flex items-center gap-2"
        >
          <span>◀</span> BACK TO HOME
        </button>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {showMissionStart ? (
        <div className="relative z-40 w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020205_90%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff8812_1px,transparent_1px),linear-gradient(to_bottom,#ff334412_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          <div className="absolute inset-6 border-2 border-[#00ff88]/30 rounded-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#ff3344] rounded-full blur-xl opacity-70 animate-spin" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/80 border-2 border-[#00ff88] flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_50px_rgba(0,255,136,0.9)] backdrop-blur-md overflow-hidden">
                {photo ? <img src={photo} alt="Commander" className="w-full h-full object-cover" /> : '🚀'}
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#ff3344] tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-[0_0_35px_rgba(0,255,136,0.9)] font-sans">
                YOUR MISSION IS START
              </h1>
              <p className="text-xs sm:text-base font-mono text-cyan-300 tracking-[0.4em] uppercase drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
                COMMANDER <span className="text-[#00ff88] font-extrabold underline">{name || 'ASTRONA'}</span>, PREPARE FOR WARP
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLaunch}
                className="group relative px-14 sm:px-20 py-5 bg-transparent overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#ff3344] opacity-90 group-hover:opacity-100 transition-opacity blur-md" />
                <div className="absolute inset-[2px] bg-[#040812] rounded-[14px] z-10 transition-colors group-hover:bg-gradient-to-r group-hover:from-[#00ff88] group-hover:to-[#22d3ee]" />
                <span className="relative z-30 font-extrabold text-xl sm:text-3xl tracking-[0.3em] font-mono text-[#00ff88] group-hover:text-black transition-colors drop-shadow-[0_0_12px_rgba(0,255,136,0.9)] flex items-center gap-3">
                  GO <span className="text-2xl sm:text-3xl">▶</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : authMode === 'selection' ? (
        <div className="relative z-20 flex flex-col sm:flex-row items-center gap-6 animate-[fadeIn_0.4s_ease-out_forwards]">
          <button
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className="group relative px-10 py-5 bg-black/85 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl text-[#00ff88] font-mono font-extrabold text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_50px_rgba(0,255,136,0.9)] hover:bg-[#00ff88] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3"
          >
            <span>⚡ REGISTER ACCOUNT</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg('');
            }}
            className="group relative px-10 py-5 bg-black/85 backdrop-blur-xl border-2 border-[#22d3ee] rounded-2xl text-[#22d3ee] font-mono font-extrabold text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.9)] hover:bg-[#22d3ee] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3"
          >
            <span>🔓 SIGN IN</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1c29" />
                  <stop offset="50%" stopColor="#0c0e17" />
                  <stop offset="100%" stopColor="#040509" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <path d="M 0,0 L 500,0 L 400,120 L 0,220 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="2" />
              <path d="M 1920,0 L 1420,0 L 1520,120 L 1920,220 Z" fill="url(#metalGrad)" stroke="#1e293b" strokeWidth="2" />
              <path d="M 700,0 L 1220,0 L 1150,80 L 770,80 Z" fill="url(#metalGrad)" stroke="#0f172a" strokeWidth="2" />
              <path d="M 0,650 L 520,600 L 1400,600 L 1920,650 L 1920,1080 L 0,1080 Z" fill="url(#metalGrad)" stroke="#334155" strokeWidth="2" />
              <rect x="90" y="650" width="420" height="260" rx="16" fill="#040812" stroke="#00ff88" strokeWidth="3" filter="url(#glow)" opacity="0.95" />
              <rect x="1410" y="650" width="420" height="260" rx="16" fill="#040812" stroke="#00ff88" strokeWidth="3" filter="url(#glow)" opacity="0.95" />
            </svg>

            <div className="absolute left-[5.5%] bottom-[19%] w-[20.5%] h-[22%] text-[#00ff88] font-mono p-4 flex flex-col justify-between overflow-hidden pointer-events-none">
              <div className="flex justify-between border-b border-[#00ff88]/50 pb-1.5 font-bold tracking-widest text-xs">
                <span className="drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">ASTRO-NAVIGATION</span>
                <span className="animate-pulse text-[#22d3ee]">SYS: ONLINE</span>
              </div>
              <div className="flex items-center gap-5 pt-2">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00ff88] relative flex items-center justify-center animate-[spin_6s_linear_infinite] shadow-[0_0_12px_rgba(0,255,136,0.4)]">
                  <div className="absolute w-12 h-12 rounded-full border border-[#22d3ee] animate-[spin_4s_linear_infinite_reverse]" />
                  <div className="absolute w-full h-[2px] bg-[#00ff88]" />
                  <div className="absolute h-full w-[2px] bg-[#00ff88]" />
                </div>
                <div className="space-y-1.5 text-xs font-semibold tracking-wide">
                  <div className="text-[#00ff88]">PITCH: +0.024°</div>
                  <div className="text-[#22d3ee]">YAW: -1.890°</div>
                  <div className="text-white">SPEED: 28,400 KM/H</div>
                </div>
              </div>
            </div>

            <div className="absolute right-[5.5%] bottom-[19%] w-[20.5%] h-[22%] text-[#00ff88] font-mono p-4 flex flex-col justify-between overflow-hidden pointer-events-none">
              <div className="flex justify-between border-b border-[#00ff88]/50 pb-1.5 font-bold tracking-widest text-xs">
                <span className="drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">SATELLITE ARRAY</span>
                <span className="text-[#ff3344] animate-pulse">TEAM ASTRO-NOVA</span>
              </div>
              <div className="flex items-center justify-between pt-2 px-2">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#00ff88]">ORBITAL SYNC</div>
                  <div className="text-[10px] text-cyan-300 font-bold">STATUS: ACTIVE</div>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-[#ff3344] relative flex items-center justify-center animate-[spin_5s_linear_infinite] shadow-[0_0_12px_rgba(255,51,68,0.4)]">
                  <div className="absolute w-10 h-10 rounded-full border border-dashed border-[#00ff88] animate-[spin_3s_linear_infinite_reverse]" />
                  <div className="absolute w-full h-[2px] bg-[#ff3344]" />
                  <div className="absolute h-full w-[2px] bg-[#ff3344]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex items-center gap-6 animate-[creativeSlideUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">

            <div className="hidden md:flex flex-col items-center justify-center w-36 h-80 bg-black/75 backdrop-blur-xl rounded-3xl border-2 border-[#00ff88]/50 shadow-[0_0_30px_rgba(0,255,136,0.3)] p-4 animate-bounce duration-1000">
              <div className="w-16 h-16 rounded-full border-2 border-[#00ff88] overflow-hidden flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,255,136,0.8)] bg-black">
                {photo ? <img src={photo} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-3xl">👨‍🚀</span>}
              </div>
              <div className="text-[10px] font-mono text-[#00ff88] text-center tracking-widest uppercase font-bold">
                COMMANDER ASSISTANT
              </div>
              <div className="mt-3 w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            </div>

            <div className="relative w-[min(94vw,440px)] bg-black/90 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border-2 border-[#00ff88]/70 shadow-[0_0_50px_rgba(0,255,136,0.3),inset_0_0_30px_rgba(0,255,136,0.1)] max-h-[90vh] overflow-y-auto">

              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00ff88]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#22d3ee]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="text-center mb-5">
                  <span className="text-xs font-mono tracking-[0.35em] text-[#22d3ee] uppercase block mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                    // SECURE AUTHENTICATION
                  </span>
                  <h1 className="font-extrabold text-2xl sm:text-2xl text-white tracking-wider uppercase font-sans drop-shadow-[0_0_10px_rgba(255,255,136,0.5)]">
                    {authMode === 'register' ? 'Create Account' : 'Commander Login'}
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-2.5 bg-red-950/90 border border-red-500/60 rounded-xl text-xs sm:text-sm text-red-300 font-mono text-center shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#00ff88] tracking-widest uppercase block drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]">
                      Commander Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Captain Lyra Nova"
                      className="w-full box-border bg-[#040d1a] text-white placeholder-slate-500 text-sm px-4 py-3 rounded-xl border-2 border-[#00ff88]/40 focus:outline-none focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/60 transition-all font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  {authMode === 'register' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[#00ff88] tracking-widest uppercase block drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]">
                          Commander Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="commander@missionforge.org"
                          className="w-full box-border bg-[#040d1a] text-white placeholder-slate-500 text-sm px-4 py-3 rounded-xl border-2 border-[#00ff88]/40 focus:outline-none focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/60 transition-all font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-[#00ff88] tracking-widest uppercase block drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]">
                          Commander Photo (Gallery)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#00ff88] file:text-black hover:file:bg-[#00dd75] cursor-pointer bg-[#040d1a] p-2 rounded-xl border-2 border-[#00ff88]/40"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#00ff88] tracking-widest uppercase block drop-shadow-[0_0_6px_rgba(0,255,136,0.6)]">
                      Secure Access Code
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full box-border bg-[#040d1a] text-white placeholder-slate-500 text-sm px-4 py-3 rounded-xl border-2 border-[#00ff88]/40 focus:outline-none focus:border-[#00ff88] focus:ring-2 focus:ring-[#00ff88]/60 transition-all font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 px-5 bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#00ff88] bg-[length:200%_auto] hover:bg-right text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-mono"
                  >
                    {authMode === 'register' ? 'Initialize Command' : 'Authorize Access'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(authMode === 'register' ? 'signin' : 'register');
                        setErrorMsg('');
                      }}
                      className="text-xs font-mono text-slate-300 hover:text-[#00ff88] transition-colors tracking-wide underline decoration-[#00ff88]/50 underline-offset-4 cursor-pointer"
                    >
                      {authMode === 'register' ? "Already registered? Sign in" : "Need a commander account? Register"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes creativeSlideUp {
          0% { opacity: 0; transform: translateY(60px) scale(0.9); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

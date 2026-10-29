import React from 'react';
import { useMission } from '../../context/MissionContext';

// পরিবর্তন করে এটি করুন:
import { missionsData } from '../../data/missionsData';

interface PlanetDetailsScreenProps {
  onProceedToCompatibility: () => void;
  onChangeDestination: () => void;
  onBackToBuilder: () => void;
}

export function PlanetDetailsScreen({
  onProceedToCompatibility,
  onChangeDestination,
  onBackToBuilder
}: PlanetDetailsScreenProps) {
  const { selectedDestination } = useMission();

  // Find active planet data or fallback to Mars
  const planet = missionsData.find(
    (m) => m.id.toLowerCase() === (selectedDestination || 'mars').toLowerCase()
  ) || {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    gravity: '3.721 m/s²',
    atmosphere: 'Thin (95% CO2, 2.6% N2)',
    temperature: '-125°C to 20°C',
    radiation: 'High (0.67 mSv/day)',
    solarPower: '590 W/m²',
    commDelay: '3 to 22 mins',
    landingReq: 'Heat Shield, Parachute & Retro-Rockets',
    description: 'The Red Planet features a harsh environment with dust storms, thin atmosphere, and extreme cold, requiring specialized descent protection.',
    objectives: [
      'Analyze atmospheric trace gases',
      'Search for subsurface liquid water indicators',
      'Deploy seismic monitoring station'
    ]
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#020205] text-white p-6 md:p-10 flex flex-col justify-between select-none overflow-y-auto font-sans">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center border-b border-[#00ff88]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBuilder}
            className="px-3 py-1.5 bg-black/60 border border-[#00ff88]/40 hover:bg-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-bold rounded-lg transition-all cursor-pointer"
          >
            ◀ ROCKET BUILDER
          </button>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest hidden sm:inline">
            // TELEMETRY & PLANETARY ANALYSIS
          </span>
        </div>

        <button
          onClick={onChangeDestination}
          className="px-4 py-1.5 bg-black/60 border border-cyan-400/50 hover:bg-cyan-400/20 text-cyan-300 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        >
          🌐 CHANGE DESTINATION
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">

        {/* Left Column: Planetary Preview & Title */}
        <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#00ff88]/20 via-cyan-500/20 to-red-500/20 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />

            {/* Holographic Planet Sphere Placeholder */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-amber-600 via-red-800 to-black border-2 border-[#00ff88]/60 shadow-[0_0_50px_rgba(0,255,136,0.4)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
              <span className="text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">🪐</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono tracking-[0.3em] text-[#00ff88] uppercase">
              DESTINATION TARGET
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-cyan-300 to-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">
              {planet.name}
            </h1>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              TYPE: {planet.type}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-sans leading-relaxed border-l-2 border-[#00ff88] pl-3 text-left">
            {planet.description}
          </p>
        </div>

        {/* Right Column: Environmental Data Cards */}
        <div className="lg:col-span-7 space-y-6">

          <div className="bg-black/75 backdrop-blur-xl border-2 border-[#00ff88]/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,136,0.15)] space-y-6">
            <h2 className="text-sm font-mono text-[#00ff88] font-bold tracking-widest uppercase border-b border-[#00ff88]/30 pb-2 flex items-center justify-between">
              <span>📊 ENVIRONMENTAL PROFILE</span>
              <span className="text-[10px] text-cyan-400 animate-pulse">LIVE SENSOR DATA</span>
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">GRAVITY</span>
                <span className="text-[#00ff88] text-sm font-bold">{planet.gravity}</span>
              </div>

              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">ATMOSPHERE</span>
                <span className="text-cyan-300 text-sm font-bold truncate block">{planet.atmosphere}</span>
              </div>

              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">TEMPERATURE</span>
                <span className="text-amber-400 text-sm font-bold">{planet.temperature}</span>
              </div>

              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">RADIATION LEVEL</span>
                <span className="text-red-400 text-sm font-bold">{planet.radiation}</span>
              </div>

              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">SOLAR POWER</span>
                <span className="text-yellow-300 text-sm font-bold">{planet.solarPower}</span>
              </div>

              <div className="bg-[#040d1a] p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">COMM DELAY</span>
                <span className="text-cyan-400 text-sm font-bold">{planet.commDelay}</span>
              </div>
            </div>

            {/* Landing System Requirement Warning Box */}
            <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-xl flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase block">
                  LANDING SYSTEM REQUIREMENT
                </span>
                <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                  {planet.landingReq}
                </p>
              </div>
            </div>

            {/* Primary Scientific Objectives */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider block font-bold">
                🎯 SCIENTIFIC OBJECTIVES
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {planet.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#00ff88] font-bold">▶</span> {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Primary Action Button */}
      <div className="pt-6 border-t border-[#00ff88]/30 flex justify-end">
        <button
          onClick={onProceedToCompatibility}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#00ff88] bg-[length:200%_auto] hover:bg-right text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono flex items-center justify-center gap-3"
        >
          <span>VERIFY ENVIRONMENT COMPATIBILITY</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}

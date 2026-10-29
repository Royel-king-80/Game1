import React from 'react';
import { useMission } from '../../context/MissionContext';
import { checkDestinationCompatibility } from '../../utils/destinationCompatibility';

interface EnvironmentCompatibilityScreenProps {
  onProceedToLaunch: () => void;
  onBackToBuilder: () => void;
}

export function EnvironmentCompatibilityScreen({
  onProceedToLaunch,
  onBackToBuilder
}: EnvironmentCompatibilityScreenProps) {
  const { selectedDestination } = useMission();

  // Mock spacecraft configuration for compatibility check (can be integrated with HangarBuilder state)
  const currentRocket = {
    mass: 1200,
    fuel: 85,
    hasLandingSystem: true,
    hasThermalShield: true,
    powerOutput: 450
  };

  const compatibilityResult = checkDestinationCompatibility(
    selectedDestination || 'mars',
    currentRocket
  );

  return (
    <div className="relative w-full h-full min-h-screen bg-[#020205] text-white p-6 md:p-10 flex flex-col justify-between select-none overflow-y-auto font-sans">

      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-[#00ff88]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBuilder}
            className="px-3 py-1.5 bg-black/60 border border-[#00ff88]/40 hover:bg-[#00ff88]/20 text-[#00ff88] text-xs font-mono font-bold rounded-lg transition-all cursor-pointer"
          >
            ◀ BACK TO BUILDER
          </button>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest hidden sm:inline">
            // SYSTEM COMPATIBILITY ENGINE
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-8">

        {/* Status Banner */}
        <div className={`p-6 rounded-2xl border-2 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] ${
          compatibilityResult.isReady
            ? 'bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.3)]'
            : 'bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)]'
        }`}>
          <div className="space-y-1 text-center sm:text-left">
            <span className={`text-xs font-mono font-bold uppercase tracking-[0.3em] ${
              compatibilityResult.isReady ? 'text-[#00ff88]' : 'text-red-400'
            }`}>
              {compatibilityResult.isReady ? 'ENVIRONMENT MATCH' : 'ENVIRONMENT MISMATCH'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-wider text-white">
              {compatibilityResult.isReady ? 'MISSION READY' : 'CONFIGURATION REQUIRED'}
            </h1>
          </div>

          <div className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-widest border ${
            compatibilityResult.isReady
              ? 'bg-[#00ff88] text-black border-[#00ff88]'
              : 'bg-red-600 text-white border-red-400 animate-pulse'
          }`}>
            {compatibilityResult.isReady ? '✔ ALL CHECKS PASSED' : '✖ CRITICAL FAILURE'}
          </div>
        </div>

        {/* Evaluation Details Box */}
        <div className="bg-black/80 backdrop-blur-xl border-2 border-[#00ff88]/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
          <h2 className="text-xs font-mono text-[#00ff88] font-bold tracking-widest uppercase border-b border-[#00ff88]/30 pb-3 flex items-center justify-between">
            <span>⚙ SYSTEM VALIDATION LOG</span>
            <span className="text-cyan-300">TARGET: {selectedDestination?.toUpperCase() || 'MARS'}</span>
          </h2>

          <div className="space-y-4 font-mono text-xs sm:text-sm">
            {compatibilityResult.checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3.5 bg-[#040d1a] rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${check.passed ? 'text-[#00ff88]' : 'text-red-500'}`}>
                    {check.passed ? '✔' : '✖'}
                  </span>
                  <div>
                    <span className="text-white font-bold block uppercase">{check.factor}</span>
                    <span className="text-[11px] text-slate-400">{check.details}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${
                  check.passed ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-red-500/20 text-red-300'
                }`}>
                  {check.passed ? 'OPTIMAL' : 'FAILED'}
                </span>
              </div>
            ))}
          </div>

          {!compatibilityResult.isReady && (
            <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <span className="text-xs font-mono font-bold text-red-300 uppercase block">
                  RECOMMENDED ACTION
                </span>
                <p className="text-xs text-red-200/80 font-mono mt-0.5">
                  The current spacecraft configuration does not meet the modeled descent or thermal requirements for this destination. Return to the rocket builder and adjust your specifications.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Action Footer */}
      <div className="pt-6 border-t border-[#00ff88]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onBackToBuilder}
          className="w-full sm:w-auto px-6 py-3 bg-black/60 border border-slate-500 hover:border-[#00ff88] text-slate-300 hover:text-[#00ff88] font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
        >
          RETURN TO ROCKET BUILDER
        </button>

        {compatibilityResult.isReady && (
          <button
            onClick={onProceedToLaunch}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00ff88] via-[#22d3ee] to-[#00ff88] bg-[length:200%_auto] hover:bg-right text-black font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(0,255,136,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono flex items-center justify-center gap-3"
          >
            <span>PROCEED TO LAUNCH SEQUENCE</span>
            <span className="text-lg">▶</span>
          </button>
        )}
      </div>

    </div>
  );
}

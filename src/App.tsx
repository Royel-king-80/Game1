import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MissionProvider, useMission } from './context/MissionContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { AISideBot } from './components/common/AISideBot';
import { GlobalNavbar } from './components/layout/GlobalNavbar';
import { MobileBlocker } from './components/common/MobileBlocker';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Auth & Landing Screens
import { SignUp } from './components/screens/SignUp';
import { WelcomeLanding } from './components/screens/WelcomeLanding';

// Mission Screens
import { StartScreen } from './components/screens/StartScreen';
import { Screen01Brief } from './components/screens/Screen01Brief';
import { Screen02Destination } from './components/screens/Screen02Destination';
import { PlanetDetailsScreen } from './components/screens/PlanetDetailsScreen';
import { EnvironmentCompatibilityScreen } from './components/screens/EnvironmentCompatibilityScreen';
import { HangarBuilder } from './components/screens/HangarBuilder';
import { Screen03Spacecraft } from './components/screens/Screen03Spacecraft';
import { Screen04Payload } from './components/screens/Screen04Payload';
import { Screen05LaunchVehicle } from './components/screens/Screen05LaunchVehicle';
import { Screen06Systems } from './components/screens/Screen06Systems';
import { Screen07Trajectory } from './components/screens/Screen07Trajectory';
import { Screen08Review } from './components/screens/Screen08Review';
import { Screen09Simulation } from './components/screens/Screen09Simulation';
import { Screen10Results } from './components/screens/Screen10Results';

const MainLayout: React.FC = () => {
  const { state, setStep } = useMission();
  const { theme } = useTheme();

  const renderScreen = () => {
    switch (state.currentStep) {
      case 'start':
        return <StartScreen />;
      case 'destination':
        return <Screen02Destination />;
      case 'planet-details':
        return (
          <PlanetDetailsScreen
            onProceedToCompatibility={() => setStep('compatibility')}
            onChangeDestination={() => setStep('destination')}
            onBackToBuilder={() => setStep('hangar')}
          />
        );
      case 'compatibility':
        return (
          <EnvironmentCompatibilityScreen
            onProceedToLaunch={() => setStep('simulation')}
            onBackToBuilder={() => setStep('hangar')}
          />
        );
      case 'hangar':
        return <HangarBuilder />;
      case 'simulation':
        return <Screen09Simulation />;
      case 'results':
        return <Screen10Results />;
      case 'review':
        return <Screen08Review />;
      case 'brief':
        return <Screen01Brief />;
      case 'spacecraft':
        return <Screen03Spacecraft />;
      case 'payload':
        return <Screen04Payload />;
      case 'launch':
        return <Screen05LaunchVehicle />;
      case 'systems':
        return <Screen06Systems />;
      case 'trajectory':
        return <Screen07Trajectory />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className={`w-screen h-screen flex flex-col ${theme === 'dark' ? 'bg-[#030305] text-[#f5f5f7]' : 'bg-[#f5f5f7] text-[#1d1d1f]'} overflow-hidden font-sans select-none relative transition-colors duration-200`}>
      <MobileBlocker />
      <GlobalNavbar />

      <div className="flex-1 w-full min-h-0 relative overflow-hidden">
        <ErrorBoundary fallbackTitle={`SCREEN FAILURE [${state.currentStep.toUpperCase()}]`}>
          <div key={state.currentStep} className="w-full h-full">
            {renderScreen()}
          </div>
        </ErrorBoundary>
      </div>

      {state.currentStep !== 'start' && <AISideBot />}
    </div>
  );
};

// Protected Component
const ProtectedMission: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainLayout /> : <Navigate to="/signup" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MissionProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<WelcomeLanding />} />

              {/* Authentication / Signup Page */}
              <Route path="/signup" element={<SignUp />} />

              {/* Main Protected Mission Route */}
              <Route path="/mission" element={<ProtectedMission />} />
            </Routes>
          </BrowserRouter>
        </MissionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

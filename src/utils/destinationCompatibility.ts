export interface RocketConfig {
  mass: number;
  fuel: number;
  hasLandingSystem: boolean;
  hasThermalShield: boolean;
  powerOutput: number;
}

export interface CompatibilityResult {
  isReady: boolean;
  checks: {
    factor: string;
    passed: boolean;
    details: string;
  }[];
}

export function checkDestinationCompatibility(
  destination: string,
  rocket: RocketConfig
): CompatibilityResult {
  const dest = destination.toLowerCase();

  // Basic validation rules based on mission requirements
  let fuelRequired = 80;
  let massLimit = 1500;
  let reqLanding = true;
  let reqThermal = true;

  if (dest === 'mars') {
    fuelRequired = 80;
    massLimit = 1400;
    reqLanding = true;
    reqThermal = true;
  } else if (dest === 'moon') {
    fuelRequired = 50;
    massLimit = 1800;
    reqLanding = true;
    reqThermal = false;
  } else if (dest === 'venus') {
    fuelRequired = 100;
    massLimit = 1200;
    reqLanding = true;
    reqThermal = true;
  }

  const fuelPassed = rocket.fuel >= fuelRequired;
  const massPassed = rocket.mass <= massLimit;
  const landingPassed = reqLanding ? rocket.hasLandingSystem : true;
  const thermalPassed = reqThermal ? rocket.hasThermalShield : true;

  const isReady = fuelPassed && massPassed && landingPassed && thermalPassed;

  return {
    isReady,
    checks: [
      {
        factor: 'Propulsion & Fuel',
        passed: fuelPassed,
        details: `Required: ${fuelRequired}% | Available: ${rocket.fuel}%`
      },
      {
        factor: 'Mass & Payload Constraint',
        passed: massPassed,
        details: `Max Limit: ${massLimit}kg | Current: ${rocket.mass}kg`
      },
      {
        factor: 'Descent & Landing System',
        passed: landingPassed,
        details: reqLanding ? 'Required active landing gear/legs' : 'Not critically required'
      },
      {
        factor: 'Thermal Protection Shield',
        passed: thermalPassed,
        details: reqThermal ? 'Required for atmospheric entry' : 'Optional for this trajectory'
      }
    ]
  };
}

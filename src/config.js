export function loadConfig() {
  let config = {
    ENV: 'production',
    API_HOST: 'http://api.keenoho.space',
    APP_ID: 2000000000000000,
  };

  let configTarget = typeof document === 'object' ? window : typeof process === 'object' ? process && process.env || null : null

  if (!configTarget) {
    return configTarget
  }
  if ('ENV' in configTarget) {
    config.ENV = configTarget.ENV
  }
  if ('API_HOST' in configTarget) {
    config.API_HOST = configTarget.API_HOST
  }
  if ('APP_ID' in configTarget) {
    config.APP_ID = configTarget.APP_ID
  }

  return config;
}

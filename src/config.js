export const sdkConfig = {
  ENV: 'production',
  API_HOST: 'http://api.keenoho.space',
  APP_ID: 2000000000000000,
};

export function loadConfig() {
  const configTarget =
    typeof document === 'object' ? window : process?.env || global;

  if (!configTarget) {
    return configTarget;
  }
  if ('ENV' in configTarget) {
    sdkConfig.ENV = configTarget.ENV;
  }
  if ('API_HOST' in configTarget) {
    sdkConfig.API_HOST = configTarget.API_HOST;
  }
  if ('APP_ID' in configTarget) {
    sdkConfig.APP_ID = configTarget.APP_ID;
  }

  return sdkConfig;
}
loadConfig()

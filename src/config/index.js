export function getConfig() {
  let appConf;
  let mode = window.MODE || 'production';
  let env = window.ENV || 'production';
  if (window.APPCONF) {
    appConf = JSON.parse(decodeURIComponent(atob(window.APPCONF)));
  }
  return {
    appConf,
    mode,
    env,
  };
}

export function setConfig(config) {
  window.MODE = config.mode;
  window.ENV = config.env;
  window.APPCONF = window.btoa(JSON.stringify(config.appConf));
}

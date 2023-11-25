// import { isBrowser } from './src/util';
import * as config from './src/config';
import * as request from './src/request';
import { SDK } from './src/sdk';

// browser auto load
// function browserAutoLoad() {
//   document.addEventListener('DOMContentLoaded', () => {
//     const scriptEle = document.querySelector('script#keenoho');
//     if (!scriptEle) {
//       return;
//     }
//     const src = scriptEle.getAttribute('src');
//     if (!src) {
//       return;
//     }
//     const searchParams = new URLSearchParams(src.split('?')[1] || '');
//     const search = {};
//     for (let k of searchParams.keys()) {
//       search[k] = searchParams.get(k);
//     }
//     if (search.autoLoad) {
//       window.KEENOHO = new SDK(search);
//     }
//   });
// }
// if (isBrowser()) {
//   browserAutoLoad();
// }

export default {
  config,
  request,
  SDK,
};

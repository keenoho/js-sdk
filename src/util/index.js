import { PLATFORM_NODE, PLATFORM_BROWSER } from '../constant';

export function judgePlatform() {
  return typeof document === 'undefined' ? PLATFORM_NODE : PLATFORM_BROWSER;
}

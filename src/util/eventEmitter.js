export default class EventEmitter {
  callbacks = {};
  addEventListener(type, callback) {
    this.callbacks[type] = callback;
  }
  removeEventListener(type) {
    delete this.callbacks[type];
  }
  emit(type, ...args) {
    if (typeof this.callbacks[type] === 'function') {
      this.callbacks[type](...args);
    }
  }
}

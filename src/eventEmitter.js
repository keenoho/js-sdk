export default class EventEmitter {
  constructor() {
    this.eventMap = {};
  }

  on(event, callback) {
    this.eventMap[event] = callback;
  }

  off(event, callback) {
    delete this.eventMap[event];
  }

  emit(event, ...args) {
    if (event in this.eventMap && typeof this.eventMap[event] === 'function') {
      this.eventMap[event](...args);
    }
  }
}

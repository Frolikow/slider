class EventEmitter {
  constructor() {
    this.observers = [];
  }

  subscribe(instance) {
    this.observers.push(instance);
  }

  unSubscribe(instance) {
    const test = this.observers.indexOf(instance);
    this.observers.splice(test, 1);
  }

  notify(name, data) {
    this.observers.forEach(instance => instance[`${name}`] && instance[`${name}`](data));
  }
}

export default EventEmitter;

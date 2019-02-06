class EventEmitter {
  constructor() {
    this.observers = [];
  }

  subscribe(instance) {
    this.observers.push(instance);
  }

  unsubscribe(instance) {
    this.observers.splice(this.observers.indexOf(instance), 1);
  }

  notify(methodName, data) {
    this.observers.forEach((instance) => {
      instance.events.includes(methodName)
        && instance[methodName](data);
    });
  }
}
export default EventEmitter;

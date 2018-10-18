class EventEmitter {
  constructor() {
    this.observers = [];
  }

  subscribe(instance) {
    this.observers.push(instance);
  }

  unSubscribe(instance) {
    this.observers.splice(this.observers.indexOf(instance), 1);
  }

  notify(name, data) {
    this.observers.forEach((instance) => {
      const observerList = instance.events[data.type];
      const instanceHasMethod = observerList && observerList.includes(name);

      const methodCheck = instanceHasMethod && instance[name](data);
    });
  }
}
export default EventEmitter;

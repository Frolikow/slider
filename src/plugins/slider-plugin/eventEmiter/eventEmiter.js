import Checkers from '../Checkers/Checkers';

class EventEmitter extends Checkers {
  constructor() {
    super();
    this.observers = [];
    this.emitter = null;
  }

  subscribe(instance) {
    this.observers.push(instance);
  }

  unsubscribe(instance) {
    this.observers.splice(this.observers.indexOf(instance), 1);
  }
  addEmitter(constructorName) {
    this.emitter = constructorName;
  }
  notify(methodName, data) {
    this.observers.forEach((instance) => {
      this.methodCheck(instance.constructor.name, this.emitter, methodName) && instance[methodName](data);
    });
  }
}
export default EventEmitter;

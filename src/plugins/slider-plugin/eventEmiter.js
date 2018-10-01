class EventEmitter {
  constructor() {
    this.observers = [];
  }

  // on(type, listener) {
  //   this.observers[type] = this.observers[type] || [];
  //   this.observers[type].push(listener);
  // }

  // emit(type, arg) {
  //   if (this.observers[type]) {
  //     this.observers[type].forEach(listener => listener(arg));
  //   }
  // }

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


// изначально я отдаю в представление опции заданые пользователем, вьюха рисуется - все ок
// после этого я по необходимости передаю опции в модель и там сохраняю. когда движется слайдер ничегоо никуда не
//  передается кроме текущего значения ползунка который должен перескочить в панель контроля(через модель?)
// а все изменения в котрол панели должны лететь в модель и производить перерасчет и после заново рендерить представление

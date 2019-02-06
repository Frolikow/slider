class Checkers {
  constructor() {
    this.allEvents = [
      {
        ViewSlider: [{
          Controller: ['updateState'],
        }],
        ViewPanel: [{
          Controller: ['updateState'],
        }],
        Model: [{
          Controller: ['sendNewDataFromModel'],
        }],
        Controller: [{
          ViewSlider: ['initSlider', 'updateSlider'],
          ViewPanel: ['initPanel', 'updatePanel'],
          Model: ['updateState'],
        }],
      },
    ];
  }

  methodCheck(instance, emitter, methodName) {
    const isExistingMethod = this.allEvents.some(() =>
      this.allEvents[0][emitter][0][instance].includes(methodName));
    return isExistingMethod;
  }
}
export default Checkers;

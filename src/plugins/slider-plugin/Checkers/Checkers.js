class Checkers {
  constructor() {
    this.allEvents = [
      {
        ViewSlider: [{
          Controller: [
            'sendCoordinatesWhenMoving',
            'sendCoordinatesWhenClick',
            'calculateIndexOfRelativeCoordinates',
          ],
        }],
        ViewPanel: [{
          Controller: [
            'updateState',
          ],
        }],
        Model: [{
          Controller: [
            'updateViewSlider',
            'updateViewPanel',
          ],
        }],
        Controller: [{
          ViewSlider: [
            'initSlider',
            'updateViewSlider',
          ],
          ViewPanel: [
            'updateViewPanel',
          ],
          Model: [
            'updateViews',
            'updateState',
            'updateValuesWhenClick',
            'updateValuesWhenMoving',
          ],
        }],
      },
    ];
  }

  methodCheck(instance, emitter, methodName) {
    const isExistingMethod = this.allEvents.some(() => this.allEvents[0][emitter][0][instance].includes(methodName));
    return isExistingMethod;
  }
}
export default Checkers;

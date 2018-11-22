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
            'sendNewDataFromModel',
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
            'sendNewDataFromModel',
            'updateState',
            'updateValuesAtStaticCoordinates',
            'updateValuesAtDynamicCoordinates',
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

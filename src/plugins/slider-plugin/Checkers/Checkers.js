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
            'updateSlider',
            'updatePanel',
            'sendNewDataFromModel',
          ],
        }],
        Controller: [{
          ViewSlider: [
            'initSlider',
            'updateSlider',
          ],
          ViewPanel: [
            'initPanel',
            'updatePanel',
          ],
          Model: [
            'sendNewDataFromModel',
            'updateState',
            'updateValuesForStaticCoordinates',
            'updateValuesForDynamicCoordinates',
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

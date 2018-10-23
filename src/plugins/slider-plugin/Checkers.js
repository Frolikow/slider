// import EventEmitter from './EventEmitter';

class Checkers {
  constructor() {
    this.allEvents = [
      {
        ViewSlider: [{
          Controller: ['initViews', 'updateViewSlider',
            'updateViewPanel', 'updatePluginOptions',
            'requestDefaultPosition', 'returnDefaultPosition',
            'clickTheSlider', 'searchPositionWhenMoving',
            'sendPositionWhenMoving'],
        }],
        ViewPanel: [{
          Controller: ['initViews', 'updateViewSlider',
            'updateViewPanel', 'updatePluginOptions',
            'requestDefaultPosition', 'returnDefaultPosition',
            'clickTheSlider', 'searchPositionWhenMoving',
            'sendPositionWhenMoving'],
        }],
        Model: [{
          Controller: ['initViews', 'updateViewSlider',
            'updateViewPanel', 'updatePluginOptions',
            'requestDefaultPosition', 'returnDefaultPosition',
            'clickTheSlider', 'searchPositionWhenMoving',
            'sendPositionWhenMoving'],
        }],
        Controller: [{
          ViewSlider: ['updateViewSlider', 'getCoords',
            'moveHandle', 'setPosition',
            'defaultPosition', 'getDefaultPosition',
            'enableVisibilityTooltips', 'orientationChange',
            'enableRangeSelection', 'renderValueInTooltip',
            'sendData'],
          ViewPanel: ['updateViewPanel', 'initAttributes',
            'createPanel', 'sendData'],
          Model: ['checksIncomingData', 'sendDataFromModel',
            'updatePluginOptionsAndSendData', 'calculationDefaultPosition',
            'calculationValue', 'moveHandleOnClick',
            'createArrayOfPosition', 'searchPositionWhenMoving'],
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

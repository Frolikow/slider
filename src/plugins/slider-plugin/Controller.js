import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    this.events = {
      model: ['initViews', 'updateViewSlider', 'updateViewPanel', 'updatePluginOptions', 'requestDefaultPosition',
        'returnDefaultPosition', 'clickTheSlider', 'searchPositionWhenMoving', 'sendPositionWhenMoving'],
      viewSlider: ['initViews', 'updateViewSlider', 'updateViewPanel', 'updatePluginOptions', 'requestDefaultPosition',
        'returnDefaultPosition', 'clickTheSlider', 'searchPositionWhenMoving', 'sendPositionWhenMoving'],
      viewPanel: ['initViews', 'updateViewSlider', 'updateViewPanel', 'updatePluginOptions', 'requestDefaultPosition',
        'returnDefaultPosition', 'clickTheSlider', 'searchPositionWhenMoving', 'sendPositionWhenMoving'],
    };
  }
  initViews() {
    this.notify('sendDataToRender', { type: 'controller' });
  }
  updateViewSlider(dataViewSlider) {
    dataViewSlider.type = 'controller';
    this.notify('updateViewSlider', dataViewSlider);
  }
  updateViewPanel(dataViewPanel) {
    dataViewPanel.type = 'controller';
    this.notify('updateViewPanel', dataViewPanel);
  }
  updatePluginOptions(dataForUpdatePlugin) {
    dataForUpdatePlugin.type = 'controller';
    this.notify('updatePluginOptionsAndSendDataToRedner', dataForUpdatePlugin);
  }


  requestDefaultPosition(dataForRequestDefaultPosition) {
    dataForRequestDefaultPosition.type = 'controller';
    this.notify('calculationDefaultPosition', dataForRequestDefaultPosition);
  }

  returnDefaultPosition(dataForReturnDefaultPosition) {
    dataForReturnDefaultPosition.type = 'controller';
    this.notify('getDefaultPosition', dataForReturnDefaultPosition);
  }

  clickTheSlider(dataForMoveHandleOnClick) {
    dataForMoveHandleOnClick.type = 'controller';
    this.notify('moveHandleOnClick', dataForMoveHandleOnClick);
  }

  searchPositionWhenMoving(dataForSearchPosition) {
    dataForSearchPosition.type = 'controller';
    this.notify('searchPositionWhenMoving', dataForSearchPosition);
  }
  sendPositionWhenMoving(dataWhenMoving) {
    dataWhenMoving.type = 'controller';
    this.notify('setPosition', dataWhenMoving);
  }
}

export default Controller;

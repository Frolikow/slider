import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }
  initViews() {
    this.notify('sendDataFromModel');
  }
  updateViewSlider(dataViewSlider) {
    this.notify('updateViewSlider', dataViewSlider);
  }
  updateViewPanel(dataViewPanel) {
    this.notify('updateViewPanel', dataViewPanel);
  }
  updatePluginOptions(dataForUpdatePlugin) {
    this.notify('updatePluginOptionsAndSendData', dataForUpdatePlugin);
  }


  requestDefaultPosition(dataForRequestDefaultPosition) {
    this.notify('calculationDefaultPosition', dataForRequestDefaultPosition);
  }

  returnDefaultPosition(dataForReturnDefaultPosition) {
    this.notify('getDefaultPosition', dataForReturnDefaultPosition);
  }

  clickTheSlider(dataForMoveHandleOnClick) {
    this.notify('moveHandleOnClick', dataForMoveHandleOnClick);
  }

  searchPositionWhenMoving(dataForSearchPosition) {
    this.notify('searchPositionWhenMoving', dataForSearchPosition);
  }
  sendPositionWhenMoving(dataWhenMoving) {
    this.notify('setPosition', dataWhenMoving);
  }
}

export default Controller;

import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  initViews() {
    this.notify('sendDataToRender');
  }
  updateViewSlider(dataForRender) {
    this.notify('updateViewSlider', dataForRender);
  }
  updateViewPanel(dataForRender) {
    this.notify('updateViewPanel', dataForRender);
  }
  updatePluginOptions(dataForUpdatePlugin) {
    this.notify('updatePluginOptionsAndSendDataToRedner', dataForUpdatePlugin);
  }


  requestDefaultPosition({ minimum, maximum, valueCurrentHandle, elementName, step, scaleWidth }) {
    this.notify('calculationDefaultPosition', { minimum, maximum, valueCurrentHandle, elementName, step, scaleWidth });
  }

  returnDefaultPosition({ defaultPosition, elementName, value }) {
    this.notify('getDefaultPosition', { defaultPosition, elementName, value });
  }

  clickTheSlider({ dataForMoveHandleOnClick, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle }) {
    this.notify('moveHandleOnClick', { dataForMoveHandleOnClick, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle });
  }

  searchPositionWhenMoving({ coordinatesInsideTheSlider, sliderWidth, elementName, dataForSearchPosition }) {
    this.notify('searchPositionWhenMoving', { coordinatesInsideTheSlider, sliderWidth, elementName, dataForSearchPosition });
  }
  sendPositionWhenMoving({ currentPositionHandle, elementName, valueTip }) {
    this.notify('setPosition', { currentPositionHandle, elementName, valueTip });
  }
}

export default Controller;

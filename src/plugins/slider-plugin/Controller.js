import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  initViews() {
    this.notify('getData');
  }
  updateViewSlider(dataForRender) {
    this.notify('updateViewSlider', dataForRender);
  }
  updateViewPanel(dataForRender) {
    this.notify('updateViewPanel', dataForRender);
  }
  changeData(data) {
    this.notify('updateData', data);
  }


  requestDefaultPosition({ minimum, maximum, value, elementName, step, scaleWidth }) {
    this.notify('calculateDefaultPosition', { minimum, maximum, value, elementName, step, scaleWidth });
  }

  returnDefaultPosition({ defaultPosition, elementName, value }) {
    this.notify('getDefaultPosition', { defaultPosition, elementName, value });
  }

  clickTheSlider({ data, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle }) {
    this.notify('moveHandleOnClick', { data, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle });
  }

  searchPositionWhenMoving({ coordinatesInsideTheSlider, sliderWidth, elementName, data }) {
    this.notify('searchPositionWhenMoving', { coordinatesInsideTheSlider, sliderWidth, elementName, data });
  }
  sendPositionWhenMoving({ currentPositionHandle, elementName, valueTip }) {
    this.notify('getPosition', { currentPositionHandle, elementName, valueTip });
  }
}

export default Controller;

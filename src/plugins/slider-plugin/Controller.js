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


  requestDefaultPosition({ minimum, maximum, value, element, step, scaleWidth }) {
    this.notify('calculateDefaultPosition', { minimum, maximum, value, element, step, scaleWidth });
  }

  returnDefaultPosition({ defaultPosition, element, value }) {
    this.notify('getDefaultPosition', { defaultPosition, element, value });
  }

  clickTheSlider({ data, sliderWidth, positionCursorClick, positionFirstElement, positionSecondElement }) {
    this.notify('moveHandleOnClick', { data, sliderWidth, positionCursorClick, positionFirstElement, positionSecondElement });
  }

  searchPositionWhenMoving({ beginEdge, endEdge, element, data }) {
    this.notify('searchPositionWhenMoving', { beginEdge, endEdge, element, data });
  }
  sendPositionWhenMoving({ currentPositionHandle, element, valueTip }) {
    this.notify('getPositionWhenMoving', { currentPositionHandle, element, valueTip });
  }
}

export default Controller;

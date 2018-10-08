import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  updateViewConfig(dataForRender) {
    this.notify('updateViewConfig', dataForRender);
  }
  updateViewSlider(dataForRender) {
    this.notify('updateViewSlider', dataForRender);
  }

  reinitState(dataForReinit) {
    this.notify('initState', dataForReinit);
  }

  requestDefaultPosition({ minimum, maximum, value, element, step, scaleWidth }) {
    this.notify('calculateDefaultPosition', { minimum, maximum, value, element, step, scaleWidth });
  }

  returnDefaultPosition({ defaultPosition, element }) {
    this.notify('getDefaultPosition', { defaultPosition, element });
  }

  clickTheSlider({ minimum, maximum, step, sliderWidth, positionCursorClick, rangeStatus, valueRange }) {
    this.notify('moveHandleOnClick', { minimum, maximum, step, sliderWidth, positionCursorClick, rangeStatus, valueRange });
  }
  updateAfterClickOnSlider({ positionCursorClick, moveToPosition, newValue, sliderWidth }) {
    this.notify('updateAfterClickOnSlider', { positionCursorClick, moveToPosition, newValue, sliderWidth });
  }

  searchPositionWhenMoving({ beginEdge, endEdge, position, positionRange, testElement, value, valueRange, step, rangeStatus, minimum, maximum }) {
    this.notify('searchPositionWhenMoving', { beginEdge, endEdge, position, positionRange, testElement, value, valueRange, step, rangeStatus, minimum, maximum });
  }
  sendPositionWhenMoving({ currentPositionHandle, testElement, valueTip }) {
    this.notify('getPositionWhenMoving', { currentPositionHandle, testElement, valueTip });
  }
}

export default Controller;

import EventEmitter from './eventEmiter';

class Controller extends EventEmitter {
  // transferDataForRender(dataForRender) {
  //   this.notify('getDataForRender', dataForRender);
  // }
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
  updateAfterClickOnSlider({ positionCursorClick, moveToPosition, newValue }) {
    this.notify('updateAfterClickOnSlider', { positionCursorClick, moveToPosition, newValue });
  }

  // updateConfiguration(){
  //   this.notify('')
  // }
}

export default Controller;

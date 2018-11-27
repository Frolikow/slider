import EventEmitter from '../eventEmiter/eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }
  initPlugin() {
    this.notify('initSlider');
    this.notify('sendNewDataFromModel');
  }
  sendNewDataFromModel(newData) {
    const dataForSlider = {
      firstRelativePosition: newData.firstRelativePosition,
      secondRelativePosition: newData.secondRelativePosition,
      value: newData.value,
      valueRange: newData.valueRange,
      rangeStatus: newData.rangeStatus,
      visibilityTooltips: newData.visibilityTooltips,
      verticalOrientation: newData.verticalOrientation,
    };
    const dataForPanel = {
      minimum: newData.minimum,
      maximum: newData.maximum,
      step: newData.step,
      value: newData.value,
      valueRange: newData.valueRange,
      rangeStatus: newData.rangeStatus,
      visibilityTooltips: newData.visibilityTooltips,
      verticalOrientation: newData.verticalOrientation,
    };
    this.updateViewSlider(dataForSlider);
    this.updateViewPanel(dataForPanel);
  }
  updateViewSlider(dataViewSlider) {
    dataViewSlider.firstPosition = this._convertValuesForViews(dataViewSlider.firstRelativePosition);
    dataViewSlider.secondPosition = this._convertValuesForViews(dataViewSlider.secondRelativePosition);
    delete dataViewSlider.firstRelativePosition;
    delete dataViewSlider.secondRelativePosition;
    this.notify('updateViewSlider', dataViewSlider);
  }
  updateViewPanel(dataViewPanel) {
    this.notify('updateViewPanel', dataViewPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }

  sendCoordinatesWhenClick(coordinates) {
    const relativeCoordinates = this._convertValuesForModel(coordinates);
    this.notify('updateValuesForStaticCoordinates', relativeCoordinates);
  }
  sendCoordinatesWhenMoving(dataForSearchPosition) {
    dataForSearchPosition.relativeCoordinates = this._convertValuesForModel(dataForSearchPosition.coordinates);
    delete dataForSearchPosition.coordinates;
    this.notify('updateValuesForDynamicCoordinates', dataForSearchPosition);
  }

  calculateIndexOfRelativeCoordinates(sliderWidth) {
    this.indexOfRelativeValues = sliderWidth / 1000;
  }
  _convertValuesForViews(data) {
    data *= this.indexOfRelativeValues;
    return data;
  }
  _convertValuesForModel(data) {
    data /= this.indexOfRelativeValues;
    return data;
  }
}

export default Controller;

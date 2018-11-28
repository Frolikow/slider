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
    const dataForSlider = { ...newData };
    delete dataForSlider.minimum;
    delete dataForSlider.maximum;
    delete dataForSlider.step;

    const dataForPanel = { ...newData };
    delete dataForPanel.firstRelativePosition;
    delete dataForPanel.secondRelativePosition;

    this.updateViewSlider(dataForSlider);
    this.updateViewPanel(dataForPanel);
  }
  updateViewSlider(dataViewSlider) {
    dataViewSlider.coordinatesFirstHandle = this._convertValuesForViews(dataViewSlider.firstRelativePosition);
    dataViewSlider.coordinatesSecondHandle = this._convertValuesForViews(dataViewSlider.secondRelativePosition);
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

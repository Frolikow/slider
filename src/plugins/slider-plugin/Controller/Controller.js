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
  sendNewDataFromModel({ dataForSlider, dataForPanel }) {
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
    this.notify('updateValuesAtStaticCoordinates', relativeCoordinates);
  }

  sendCoordinatesWhenMoving(dataForSearchPosition) {
    dataForSearchPosition.relativeCoordinates = this._convertValuesForModel(dataForSearchPosition.coordinates);
    delete dataForSearchPosition.coordinates;
    this.notify('updateValuesAtDynamicCoordinates', dataForSearchPosition);
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

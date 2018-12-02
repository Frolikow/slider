import EventEmitter from '../eventEmiter/eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }
  initPlugin() {
    this.notify('initSlider');
    this.notify('initPanel');
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

    this.updateSlider(dataForSlider);
    this.updatePanel(dataForPanel);
  }
  updateSlider(dataViewSlider) {
    dataViewSlider.coordinatesFirstHandle = this._convertValuesForViews(dataViewSlider.firstRelativePosition);
    dataViewSlider.coordinatesSecondHandle = this._convertValuesForViews(dataViewSlider.secondRelativePosition);
    delete dataViewSlider.firstRelativePosition;
    delete dataViewSlider.secondRelativePosition;
    this.notify('updateSlider', dataViewSlider);
  }
  updatePanel(dataViewPanel) {
    this.notify('updatePanel', dataViewPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }

  // ////////////////////
  // ////////////////////
  // ////////////////////
  // ////////////////////
  // ////////////////////

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


// перенести методы для расчета значений сюда. а методы расчета позиции во вьюху при чем переделать без массива, индекс можно получать
// вычитая из минимума значение. в процессе продумать как обрабатывать исключения типа макс для first и мин для second при вкл интервале

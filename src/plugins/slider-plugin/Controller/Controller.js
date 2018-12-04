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
    const dataForSlider = {
      coordinatesFirstHandle: newData.firstRelativePosition,
      coordinatesSecondHandle: newData.secondRelativePosition,
      value: newData.value,
      valueRange: newData.valueRange,
      isIntervalSelection: newData.isIntervalSelection,
      isVerticalOrientation: newData.isVerticalOrientation,
      isVisibilityTooltips: newData.isVisibilityTooltips,
    };

    const dataForPanel = {
      isIntervalSelection: newData.isIntervalSelection,
      isVerticalOrientation: newData.isVerticalOrientation,
      isVisibilityConfigPanel: newData.isVisibilityConfigPanel,
      isVisibilityTooltips: newData.isVisibilityTooltips,
      value: newData.value,
      valueRange: newData.valueRange,
      step: newData.step,
      maximum: newData.maximum,
      minimum: newData.minimum,
    };
    this.updateSlider(dataForSlider);
    this.updatePanel(dataForPanel);
  }

  updateSlider(dataSlider) {
    dataSlider.coordinatesFirstHandle = this._convertValuesForViews(dataSlider.coordinatesFirstHandle);
    dataSlider.coordinatesSecondHandle = this._convertValuesForViews(dataSlider.coordinatesSecondHandle);
    this.notify('updateSlider', dataSlider);
  }
  updatePanel(dataViewPanel) {
    this.notify('updatePanel', dataViewPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }


  sendCoordinatesWhenClick(coordinates) {
    const relativeCoordinates = this._convertValuesForModel(coordinates);
    this.notify('updateValuesForStaticCoordinates', relativeCoordinates);
  }
  sendCoordinatesWhenMoving(dataForSearchPosition) {
    const dataForCalculatePosition = {
      elementType: dataForSearchPosition.elementType,
      isIntervalSelection: dataForSearchPosition.isIntervalSelection,
      relativeCoordinates: this._convertValuesForModel(dataForSearchPosition.coordinates),
    };
    this.notify('updateValuesForDynamicCoordinates', dataForCalculatePosition);
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

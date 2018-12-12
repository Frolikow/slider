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
    const {
      value,
      valueRange,
      minimum,
      maximum,
      step,
      isVisibilityConfigPanel,
      hasIntervalSelection,
      isVerticalOrientation,
      areTooltipsVisible,
      firstRelativePosition,
      secondRelativePosition,
    } = newData;

    const dataForSlider = { firstHandleCoordinates: firstRelativePosition, secondHandleCoordinates: secondRelativePosition, value, valueRange, hasIntervalSelection, isVerticalOrientation, areTooltipsVisible };
    const dataForPanel = { value, valueRange, minimum, maximum, step, hasIntervalSelection, isVerticalOrientation, isVisibilityConfigPanel, areTooltipsVisible };

    this.updateSlider(dataForSlider);
    this.updatePanel(dataForPanel);
  }

  updateSlider(dataSlider) {
    dataSlider.firstHandleCoordinates = this._convertValuesForViews(dataSlider.firstHandleCoordinates);
    dataSlider.secondHandleCoordinates = this._convertValuesForViews(dataSlider.secondHandleCoordinates);

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
      hasIntervalSelection: dataForSearchPosition.hasIntervalSelection,
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

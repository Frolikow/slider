import EventEmitter from '../eventEmiter/eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = {
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      rangeStatus: options.rangeStatus,
      visibilityTooltips: options.visibilityTooltips,
      verticalOrientation: options.verticalOrientation,
    };
    this.relativeSliderWidth = 1000;

    this._checksIncomingData();
  }

  updateState(newData) {
    this.modelData.minimum = (newData.minimum === undefined) ? this.modelData.minimum : newData.minimum;
    this.modelData.maximum = (newData.maximum === undefined) ? this.modelData.maximum : newData.maximum;
    this.modelData.value = (newData.value === undefined) ? this.modelData.value : newData.value;
    this.modelData.valueRange = (newData.valueRange === undefined) ? this.modelData.valueRange : newData.valueRange;
    this.modelData.step = (newData.step === undefined) ? this.modelData.step : newData.step;
    this.modelData.rangeStatus = (newData.rangeStatus === undefined) ? this.modelData.rangeStatus : newData.rangeStatus;
    this.modelData.visibilityTooltips = (newData.visibilityTooltips === undefined) ? this.modelData.visibilityTooltips : newData.visibilityTooltips;
    this.modelData.verticalOrientation = (newData.verticalOrientation === undefined) ? this.modelData.verticalOrientation : newData.verticalOrientation;
    this._checksIncomingData();
    this.updateViews();
  }
  updateViews() {
    const dataViewSlider = {
      value: this.modelData.value,
      valueRange: this.modelData.valueRange,
      firstRelativePosition: this._calculationRelativePosition(this.modelData.value),
      secondRelativePosition: this._calculationRelativePosition(this.modelData.valueRange),
      rangeStatus: this.modelData.rangeStatus,
      visibilityTooltips: this.modelData.visibilityTooltips,
      verticalOrientation: this.modelData.verticalOrientation,
    };
    const dataViewPanel = {
      value: this.modelData.value,
      valueRange: this.modelData.valueRange,
      minimum: this.modelData.minimum,
      maximum: this.modelData.maximum,
      step: this.modelData.step,
    };
    this.notify('updateViewSlider', dataViewSlider);
    this.notify('updateViewPanel', dataViewPanel);
  }
  updateValuesWhenClick(relativeCoordinates) { // обработка клика по шкале слайдера
    const calculatedValue = this._calculationValue(relativeCoordinates);
    this.firstRelativePosition = this._calculationRelativePosition(this.modelData.value);
    this.secondRelativePosition = this._calculationRelativePosition(this.modelData.valueRange);

    if (this.modelData.rangeStatus) { // если интервал ВКЛючен
      if (relativeCoordinates < this.firstRelativePosition) { // если новая позиция < позиции первого элемента
        this.modelData.value = parseInt(calculatedValue);
      } else if (relativeCoordinates > this.secondRelativePosition) { // если новая позиция > позиции второго элемента
        if (calculatedValue > this.modelData.maximum) {
          this.modelData.valueRange = parseInt(this.modelData.maximum);
        } else {
          this.modelData.valueRange = parseInt(calculatedValue);
        }
      } else { // если новая позиция между элементами
        const clickedCloserToTheSecondElement = (relativeCoordinates - this.firstRelativePosition) > (this.secondRelativePosition - relativeCoordinates);
        const clickedCloserToTheFirstElement = (relativeCoordinates - this.firstRelativePosition) < (this.secondRelativePosition - relativeCoordinates);
        if (clickedCloserToTheSecondElement) { // если клик между элементами ближе ко второму элементу
          this.modelData.valueRange = parseInt(calculatedValue);
        } else if (clickedCloserToTheFirstElement) { // если клик между элементами ближе к первому элементу
          this.modelData.value = parseInt(calculatedValue);
        }
      }
    } else { // если интервал ВЫКЛючен
      this.modelData.value = parseInt(calculatedValue);
    }
    this.updateViews();
  }
  updateValuesWhenMoving(dataForSearchPosition) {
    const calculatedValue = this._calculationValue(dataForSearchPosition.relativeCoordinates);
    this.firstRelativePosition = this._calculationRelativePosition(this.modelData.value + this.modelData.step);
    this.secondRelativePosition = this._calculationRelativePosition(this.modelData.valueRange - this.modelData.step);

    if (this.modelData.rangeStatus) { // если интервал ВКЛючен
      if (dataForSearchPosition.elementType === 'first') {
        if (dataForSearchPosition.relativeCoordinates <= this.secondRelativePosition) {
          this.modelData.value = parseInt(calculatedValue);
        }
      } else if (dataForSearchPosition.elementType === 'second') {
        if (dataForSearchPosition.relativeCoordinates >= this.firstRelativePosition) {
          this.modelData.valueRange = parseInt(calculatedValue);
        }
      }
    } else { // если интервал ВЫКЛючен
      this.modelData.value = parseInt(calculatedValue);
    }
    this.updateViews();
  }
  _checksIncomingData() {
    this.modelData.minimum = (this.modelData.minimum === undefined) ? 1 : this.modelData.minimum;
    this.modelData.maximum = (this.modelData.maximum === undefined) ? 10 : this.modelData.maximum;
    this.modelData.value = (this.modelData.value === undefined) ? this.modelData.minimum : this.modelData.value;
    this.modelData.valueRange = (this.modelData.valueRange === undefined) ? this.modelData.maximum : this.modelData.valueRange;
    this.modelData.step = (this.modelData.step === undefined) ? 1 : this.modelData.step;

    if (this.modelData.minimum >= this.modelData.maximum) {
      this.modelData.minimum = 1;
      this.modelData.maximum = 10;
      console.log('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
    }
    const checkingStepValue = (this.modelData.step < 1 || this.modelData.step > (this.modelData.maximum - this.modelData.minimum));
    if (checkingStepValue) {
      this.modelData.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const checkingValue = this.modelData.value > this.modelData.maximum || this.modelData.value < this.modelData.minimum;
    if (checkingValue) {
      this.modelData.value = this.modelData.minimum;
      this.modelData.valueRange = this.modelData.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (this.modelData.rangeStatus) {
      const checkingValueRange = this.modelData.valueRange > this.modelData.maximum;
      if (checkingValueRange) {
        this.modelData.value = this.modelData.minimum;
        this.modelData.valueRange = this.modelData.maximum;
        console.log('Неккоректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
      }
      if (this.modelData.value >= this.modelData.valueRange) {
        this.modelData.valueRange = this.modelData.value;
        this.modelData.value -= this.modelData.step;
        console.log('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
      }
    }
  }
  _calculationRelativePosition(value) {
    const arrayOfValues = this._createArray(null);

    const stepWidth = this.relativeSliderWidth / (arrayOfValues.length - 1);
    let position = stepWidth * (arrayOfValues.indexOf(value));

    if (position <= 0) {
      position = 0;
    } else if (position >= this.relativeSliderWidth) {
      position = this.relativeSliderWidth;
    }
    if (value === this.modelData.value) {
      if (arrayOfValues.includes(value) === false) {
        position = 0;
      }
    } else if (value === this.modelData.valueRange) {
      if (arrayOfValues.includes(value) === false) {
        position = this.relativeSliderWidth;
      }
    }
    return position;
  }
  _calculationValue(relativeCoordinates) { // расчет значения над ползунком
    const arrayOfValues = this._createArray(null);
    if (relativeCoordinates <= 0) {
      relativeCoordinates = 0;
    } else if (relativeCoordinates >= this.relativeSliderWidth) {
      relativeCoordinates = this.relativeSliderWidth;
    }

    const valueStep = this.relativeSliderWidth / ((arrayOfValues[arrayOfValues.length - 1] - arrayOfValues[0]) / this.modelData.step);
    const indexNumberValue = (((relativeCoordinates) + (valueStep / 2)) / valueStep) ^ 0;

    const checkingTheValueWhenMoving = this.modelData.rangeStatus && (indexNumberValue >= arrayOfValues.indexOf(this.modelData.valueRange - this.modelData.step)); // проверка значения при движении левого ползунка
    let newValue;
    if (this.modelData.rangeStatus) {
      newValue = (arrayOfValues[indexNumberValue] === undefined) ? arrayOfValues[arrayOfValues.length - 1] : arrayOfValues[indexNumberValue];
    } else {
      if (checkingTheValueWhenMoving) {
        newValue = (this.modelData.valueRange - this.modelData.step);
      } else {
        newValue = (arrayOfValues[indexNumberValue] === undefined) ? arrayOfValues[arrayOfValues.length - 1] : arrayOfValues[indexNumberValue];
      }
    }
    return newValue;
  }
  _createArray(elementType) {
    let currentValue = 0;
    let arrMin = this.modelData.minimum;
    let arrMax = this.modelData.maximum;
    const arrayOfValues = [];
    if (elementType && elementType === 'first') {
      arrMax = this.modelData.valueRange - this.modelData.step;
    }
    while (currentValue < arrMax) {
      if (arrMin > arrMax) {
        break;
      } else {
        currentValue = arrMin;
        arrMin += this.modelData.step;
        arrayOfValues.push(currentValue);
      }
    }
    return arrayOfValues;
  }
}

export default Model;

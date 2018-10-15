import EventEmitter from './eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();
    this.pluginOptions = {
      $slider: options.slider,
      visibilityConfigPanel: options.visibilityConfigPanel,
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      visibilityTooltips: options.visibilityTooltips,
      verticalOrientation: options.verticalOrientation,
      rangeStatus: options.rangeStatus,
    };
    this.checksIncomingData();
  }
  checksIncomingData() {
    this.pluginOptions.visibilityConfigPanel = Boolean(this.pluginOptions.visibilityConfigPanel) || false;
    this.pluginOptions.minimum = Number(this.pluginOptions.minimum) || 1;
    this.pluginOptions.maximum = Number(this.pluginOptions.maximum) || 10;
    this.pluginOptions.value = Number(this.pluginOptions.value) || this.pluginOptions.minimum;
    this.pluginOptions.valueRange = Number(this.pluginOptions.valueRange) || this.pluginOptions.maximum;
    this.pluginOptions.step = Number(this.pluginOptions.step) || 1;
    this.pluginOptions.visibilityTooltips = Boolean(this.pluginOptions.visibilityTooltips) || false;
    this.pluginOptions.verticalOrientation = Boolean(this.pluginOptions.verticalOrientation) || false;
    this.pluginOptions.rangeStatus = Boolean(this.pluginOptions.rangeStatus) || false;

    if (this.pluginOptions.minimum >= this.pluginOptions.maximum) {
      this.pluginOptions.minimum = 1;
      this.pluginOptions.maximum = 10;
      console.log('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
    }
    const checkingStepValue = (this.pluginOptions.step < 1 || this.pluginOptions.step > (this.pluginOptions.maximum - this.pluginOptions.minimum));
    if (checkingStepValue) {
      this.pluginOptions.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const checkingValue = this.pluginOptions.value > this.pluginOptions.maximum || this.pluginOptions.value < this.pluginOptions.minimum;
    if (checkingValue) {
      this.pluginOptions.value = this.pluginOptions.minimum;
      this.pluginOptions.valueRange = this.pluginOptions.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (this.pluginOptions.rangeStatus) {
      const checkingValueRange = this.pluginOptions.valueRange > this.pluginOptions.maximum;
      if (checkingValueRange) {
        this.pluginOptions.value = this.pluginOptions.minimum;
        this.pluginOptions.valueRange = this.pluginOptions.maximum;
        console.log('Неккоректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
      }
      if (this.pluginOptions.value >= this.pluginOptions.valueRange) {
        this.pluginOptions.valueRange = this.pluginOptions.value;
        this.pluginOptions.value -= this.pluginOptions.step;
        console.log('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
      }
    }
  }

  sendDataToRender() {
    this.notify('updateViewSlider', this.pluginOptions);
    this.notify('updateViewPanel', this.pluginOptions);
  }
  updatePluginOptionsAndSendDataToRedner(newData) {
    this.pluginOptions.visibilityConfigPanel = newData.visibilityConfigPanel;
    this.pluginOptions.minimum = newData.minimum;
    this.pluginOptions.maximum = newData.maximum;
    this.pluginOptions.value = newData.value;
    this.pluginOptions.valueRange = newData.valueRange;
    this.pluginOptions.step = newData.step;
    this.pluginOptions.visibilityTooltips = newData.visibilityTooltips;
    this.pluginOptions.verticalOrientation = newData.verticalOrientation;
    this.pluginOptions.rangeStatus = newData.rangeStatus;
    this.checksIncomingData();
    this.sendDataToRender();
  }

  calculationDefaultPosition({ minimum, maximum, valueCurrentHandle, elementName, step, scaleWidth }) { // установка ползунка в позицию "по-умолчанию" = value
    const defaultValuesArray = [];
    let currentValue = 0;

    if (valueCurrentHandle <= minimum) {
      valueCurrentHandle = minimum;
    } else if (valueCurrentHandle >= maximum) {
      valueCurrentHandle = maximum;
    }
    let defaultMinimum = minimum;
    while (currentValue < maximum) {
      if (defaultMinimum > maximum) {
        break;
      } else {
        currentValue = defaultMinimum;
        defaultMinimum += step;
        defaultValuesArray.push(currentValue);
      }
    }

    const stepOfDefaultPosition = scaleWidth / (defaultValuesArray.length - 1);
    const currentIndexDefaultPosition = defaultValuesArray.indexOf(valueCurrentHandle);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (elementName === 'first') {
      this.pluginOptions.value = valueCurrentHandle;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.pluginOptions.value = defaultValuesArray[0];
      }
    } else if (elementName === 'second') {
      this.pluginOptions.valueRange = valueCurrentHandle;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.pluginOptions.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
    }

    this.notify('returnDefaultPosition', { defaultPosition, elementName, valueCurrentHandle });
  }

  calculationValue({ dataForCalculation, sliderWidth, coordinates }) { // расчет значения над ползунком
    const arrayOfValues = this.createArrayOfPosition(null, dataForCalculation);
    const valueStep = sliderWidth / (arrayOfValues[arrayOfValues.length - 1] - arrayOfValues[0]);
    const indexNumberValue = ((coordinates + (valueStep / 2)) / valueStep) ^ 0;

    const checkingTheValueWhenMoving = dataForCalculation.rangeStatus && (indexNumberValue >= arrayOfValues.indexOf(dataForCalculation.valueRange - dataForCalculation.step)); // проверка значения при движении левого ползунка
    let newValue;
    if (dataForCalculation.rangeStatus) {
      newValue = arrayOfValues[indexNumberValue] || arrayOfValues[arrayOfValues.length - 1];
    } else {
      if (checkingTheValueWhenMoving) {
        newValue = (dataForCalculation.valueRange - dataForCalculation.step);
      } else {
        newValue = arrayOfValues[indexNumberValue] || arrayOfValues[arrayOfValues.length - 1];
      }
    }
    return newValue;
  }

  moveHandleOnClick({ dataForMoveHandleOnClick, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle }) { // обработка клика по шкале слайдера
    const arrayPositionAtClick = this.createArrayOfPosition(null, dataForMoveHandleOnClick);

    const stepWidth = (sliderWidth / ((arrayPositionAtClick[arrayPositionAtClick.length - 1] - arrayPositionAtClick[0]) / dataForMoveHandleOnClick.step));
    let newPosition;
    const indexNumberValue = ((clickCoordinatesInsideTheHandle + (stepWidth / 2)) / stepWidth) ^ 0;
    const middleBetweenElements = parseInt((stepWidth * indexNumberValue) + (stepWidth / 2));

    if (clickCoordinatesInsideTheHandle < middleBetweenElements) {
      newPosition = (stepWidth * indexNumberValue);
    } else if (clickCoordinatesInsideTheHandle > middleBetweenElements) {
      newPosition = (stepWidth * indexNumberValue) + stepWidth;
    }

    if (newPosition > sliderWidth) {
      newPosition = sliderWidth;
    }

    const newValue = this.calculationValue({ dataForCalculation: dataForMoveHandleOnClick, sliderWidth, coordinates: clickCoordinatesInsideTheHandle });

    const checkingPositionForHandleElem = ((clickCoordinatesInsideTheHandle - positionFirstHandle) > (positionSecondHandle - clickCoordinatesInsideTheHandle));
    const checkingPositionForHandleElemRange = ((clickCoordinatesInsideTheHandle - positionFirstHandle) < (positionSecondHandle - clickCoordinatesInsideTheHandle));

    if (dataForMoveHandleOnClick.rangeStatus) { // если интервал включен
      if (clickCoordinatesInsideTheHandle < positionFirstHandle) { // если новая позиция < позиции первого элемента
        dataForMoveHandleOnClick.value = parseInt(newValue);
      } else if (clickCoordinatesInsideTheHandle > positionSecondHandle) { // если новая позиция > позиции второго элемента
        if (clickCoordinatesInsideTheHandle > sliderWidth) {
          dataForMoveHandleOnClick.valueRange = parseInt(dataForMoveHandleOnClick.maximum);
        } else {
          dataForMoveHandleOnClick.valueRange = parseInt(newValue);
        }
      } else { // если новая позиция между элементами
        if (checkingPositionForHandleElem) { // если клик между элементами ближе ко второму элементу
          dataForMoveHandleOnClick.valueRange = parseInt(newValue);
        } else if (checkingPositionForHandleElemRange) { // если клик между элементами ближе к первому элементу
          dataForMoveHandleOnClick.value = parseInt(newValue);
        }
      }
    } else { // если интервал ВЫКЛючен
      dataForMoveHandleOnClick.value = parseInt(newValue);
    }
    this.updatePluginOptionsAndSendDataToRedner(dataForMoveHandleOnClick);
  }
  createArrayOfPosition(elementName, dataForCreateArrays) {
    let currentValue = 0;
    let arrMin = dataForCreateArrays.minimum;
    let arrMax = dataForCreateArrays.maximum;
    const arrayOfValues = [];
    if (elementName && elementName === 'first') {
      arrMax = dataForCreateArrays.valueRange - dataForCreateArrays.step;
    }
    while (currentValue < arrMax) {
      if (arrMin > arrMax) {
        break;
      } else {
        currentValue = arrMin;
        arrMin += dataForCreateArrays.step;
        arrayOfValues.push(currentValue);
      }
    }
    return arrayOfValues;
  }

  searchPositionWhenMoving({ coordinatesInsideTheSlider, sliderWidth, elementName, dataForSearchPosition }) {
    const arrayOfPosition = this.createArrayOfPosition(null, dataForSearchPosition);
    const arrayOfPositionRange = this.createArrayOfPosition(elementName, dataForSearchPosition);

    if (coordinatesInsideTheSlider < 0) {
      coordinatesInsideTheSlider = 0;
    }
    if (coordinatesInsideTheSlider > sliderWidth) {
      coordinatesInsideTheSlider = sliderWidth;
    }

    let valueTip = this.calculationValue({ dataForCalculation: dataForSearchPosition, sliderWidth, coordinates: coordinatesInsideTheSlider });

    const widthOfstep = (sliderWidth / (arrayOfPosition.length - 1)); // ширина шага
    const halfWidthOfStep = (widthOfstep / 2); // половина щирины шага

    const currentIndex = arrayOfPosition.indexOf(dataForSearchPosition.value); // индекс первого значения в массиве arrayOfPosition
    let currentPositionHandle = widthOfstep * currentIndex; // текущая позиция первого элемента

    const currentIndexRange = arrayOfPositionRange.indexOf(dataForSearchPosition.valueRange - dataForSearchPosition.step);// индекс второго значения в массиве arrayOfPositionRange
    let currentPositionHandleRange = widthOfstep * currentIndexRange;// текущая позиция второго элемента

    const currentPositionCursor = coordinatesInsideTheSlider * dataForSearchPosition.step; // текущее положение курсора внутри слайдера
    const middleOfPosition = currentPositionHandle + halfWidthOfStep; // расстояние в пол шага справа от первого элемента
    const checkingMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (arrayOfPositionRange.length - 1)) || currentIndexRange === -1);
    const checkingMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (arrayOfPosition.length - 1)) || currentIndex === -1);
    const checkingMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (arrayOfPosition.length - 1)) || dataForSearchPosition.valueRange === -1);
    const checkingMinimumForHandleRange = (currentPositionCursor <= (widthOfstep * arrayOfPosition.indexOf(dataForSearchPosition.value + dataForSearchPosition.step)));

    if (elementName === 'first') {
      if (dataForSearchPosition.rangeStatus) {
        if (checkingMaximumForHandleWithIntervalIncluded) { // проверка максимума для первого элемента при включенном интервале
          currentPositionHandle = currentPositionHandleRange;
          valueTip = dataForSearchPosition.valueRange - dataForSearchPosition.step;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      } else {
        if (checkingMaximumForHandleWithIntervalTurnedOff) { // проверка максимума для первого элемента при ВЫКЛюченном интервале
          currentPositionHandle = sliderWidth;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      }
      dataForSearchPosition.value = valueTip;
    } else if (elementName === 'second') {
      if (checkingMaximumForHandleRange) { // проверка максимума второго элемента
        currentPositionHandleRange = sliderWidth;
      } else if (checkingMinimumForHandleRange) { // проверка минимума второго элемента
        currentPositionHandleRange = widthOfstep * arrayOfPosition.indexOf(dataForSearchPosition.value + dataForSearchPosition.step);
        valueTip = dataForSearchPosition.value + dataForSearchPosition.step;
      } else if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
      dataForSearchPosition.valueRange = valueTip;
    }
    this.notify('sendPositionWhenMoving', { currentPositionHandle, elementName, valueTip });
    this.notify('updateViewPanel', this.pluginOptions);
  }
}

export default Model;

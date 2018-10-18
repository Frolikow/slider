import EventEmitter from './eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();

    this.events = {
      controller: ['checksIncomingData', 'sendDataToRender', 'updatePluginOptionsAndSendDataToRedner', 'calculationDefaultPosition', 'calculationValue',
        'moveHandleOnClick', 'createArrayOfPosition', 'searchPositionWhenMoving'],
    };

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
    const dataForRender = this.pluginOptions;
    dataForRender.type = 'model';
    this.notify('updateViewSlider', dataForRender);
    dataForRender.type = 'model';
    this.notify('updateViewPanel', dataForRender);
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

  calculationDefaultPosition(dataForRequestDefaultPosition) { // установка ползунка в позицию "по-умолчанию" = value
    const defaultValuesArray = [];
    let currentValue = 0;

    if (dataForRequestDefaultPosition.valueCurrentHandle <= dataForRequestDefaultPosition.minimum) {
      dataForRequestDefaultPosition.valueCurrentHandle = dataForRequestDefaultPosition.minimum;
    } else if (dataForRequestDefaultPosition.valueCurrentHandle >= dataForRequestDefaultPosition.maximum) {
      dataForRequestDefaultPosition.valueCurrentHandle = dataForRequestDefaultPosition.maximum;
    }
    let defaultMinimum = dataForRequestDefaultPosition.minimum;
    while (currentValue < dataForRequestDefaultPosition.maximum) {
      if (defaultMinimum > dataForRequestDefaultPosition.maximum) {
        break;
      } else {
        currentValue = defaultMinimum;
        defaultMinimum += dataForRequestDefaultPosition.step;
        defaultValuesArray.push(currentValue);
      }
    }

    const stepOfDefaultPosition = dataForRequestDefaultPosition.scaleWidth / (defaultValuesArray.length - 1);
    const currentIndexDefaultPosition = defaultValuesArray.indexOf(dataForRequestDefaultPosition.valueCurrentHandle);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (dataForRequestDefaultPosition.elementName === 'first') {
      this.pluginOptions.value = dataForRequestDefaultPosition.valueCurrentHandle;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.pluginOptions.value = defaultValuesArray[0];
      }
    } else if (dataForRequestDefaultPosition.elementName === 'second') {
      this.pluginOptions.valueRange = dataForRequestDefaultPosition.valueCurrentHandle;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.pluginOptions.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
    }
    const dataForReturnDefaultPosition = { defaultPosition, elementName: dataForRequestDefaultPosition.elementName, valueCurrentHandle: dataForRequestDefaultPosition.valueCurrentHandle, type: 'model' };
    this.notify('returnDefaultPosition', dataForReturnDefaultPosition);
  }

  calculationValue({ dataForCalculation, sliderWidth, coordinates }) { // расчет значения над ползунком
    const arrayOfValues = this.createArrayOfPosition(null, dataForCalculation);
    const valueStep = sliderWidth / ((arrayOfValues[arrayOfValues.length - 1] - arrayOfValues[0]) / dataForCalculation.step);
    const indexNumberValue = (((coordinates * dataForCalculation.step) + (valueStep / 2)) / valueStep) ^ 0;

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

  moveHandleOnClick(dataForMoveHandleOnClick) { // обработка клика по шкале слайдера
    const arrayPositionAtClick = this.createArrayOfPosition(null, dataForMoveHandleOnClick);
    dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle /= dataForMoveHandleOnClick.step;

    const stepWidth = (dataForMoveHandleOnClick.sliderWidth / ((arrayPositionAtClick[arrayPositionAtClick.length - 1] - arrayPositionAtClick[0]) / dataForMoveHandleOnClick.step));
    let newPosition;
    const indexNumberValue = ((dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle + (stepWidth / 2)) / stepWidth) ^ 0;
    const middleBetweenElements = parseInt((stepWidth * indexNumberValue) + (stepWidth / 2));
    if (dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle < middleBetweenElements) {
      newPosition = (stepWidth * indexNumberValue);
    } else if (dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle > middleBetweenElements) {
      newPosition = (stepWidth * indexNumberValue) + stepWidth;
    }

    if (newPosition > dataForMoveHandleOnClick.sliderWidth) {
      newPosition = dataForMoveHandleOnClick.sliderWidth;
    }
    const newValue = this.calculationValue({ dataForCalculation: dataForMoveHandleOnClick, sliderWidth: dataForMoveHandleOnClick.sliderWidth, coordinates: dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle });
    dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle *= dataForMoveHandleOnClick.step;

    const checkingPositionForHandleElem = ((dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle - dataForMoveHandleOnClick.positionFirstHandle) > (dataForMoveHandleOnClick.positionSecondHandle - dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle));
    const checkingPositionForHandleElemRange = ((dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle - dataForMoveHandleOnClick.positionFirstHandle) < (dataForMoveHandleOnClick.positionSecondHandle - dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle));

    if (dataForMoveHandleOnClick.rangeStatus) { // если интервал включен
      if (dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle < dataForMoveHandleOnClick.positionFirstHandle) { // если новая позиция < позиции первого элемента
        dataForMoveHandleOnClick.value = parseInt(newValue);
      } else if (dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle > dataForMoveHandleOnClick.positionSecondHandle) { // если новая позиция > позиции второго элемента
        if (dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle > dataForMoveHandleOnClick.sliderWidth) {
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

  searchPositionWhenMoving(dataForSearchPosition) {
    const arrayOfPosition = this.createArrayOfPosition(null, dataForSearchPosition);
    const arrayOfPositionRange = this.createArrayOfPosition(dataForSearchPosition.elementName, dataForSearchPosition);

    if (dataForSearchPosition.coordinatesInsideTheSlider < 0) {
      dataForSearchPosition.coordinatesInsideTheSlider = 0;
    }
    if (dataForSearchPosition.coordinatesInsideTheSlider > dataForSearchPosition.sliderWidth) {
      dataForSearchPosition.coordinatesInsideTheSlider = dataForSearchPosition.sliderWidth;
    }
    let valueTip = this.calculationValue({ dataForCalculation: dataForSearchPosition, sliderWidth: dataForSearchPosition.sliderWidth, coordinates: dataForSearchPosition.coordinatesInsideTheSlider });

    const widthOfstep = (dataForSearchPosition.sliderWidth / ((arrayOfPosition[arrayOfPosition.length - 1] - arrayOfPosition[0]) / dataForSearchPosition.step)); // ширина шага
    const halfWidthOfStep = (widthOfstep / 2); // половина щирины шага


    const currentIndex = arrayOfPosition.indexOf(dataForSearchPosition.value); // индекс первого значения в массиве arrayOfPosition
    let currentPositionHandle = widthOfstep * (currentIndex); // текущая позиция первого элемента

    const currentIndexRange = arrayOfPositionRange.indexOf(dataForSearchPosition.valueRange - dataForSearchPosition.step);// индекс второго значения в массиве arrayOfPositionRange
    let currentPositionHandleRange = widthOfstep * currentIndexRange;// текущая позиция второго элемента


    const currentPositionCursor = dataForSearchPosition.coordinatesInsideTheSlider * dataForSearchPosition.step; // текущее положение курсора внутри слайдера
    const middleOfPosition = currentPositionHandle + halfWidthOfStep; // расстояние в пол шага справа от первого элемента
    const checkingMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (arrayOfPositionRange.length - 1)) || currentIndexRange === -1);
    const checkingMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (arrayOfPosition.length - 1)) || currentIndex === -1);
    const checkingMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (arrayOfPosition.length - 1)) || dataForSearchPosition.valueRange === -1);
    const checkingMinimumForHandleRange = (currentPositionCursor <= (widthOfstep * arrayOfPosition.indexOf(dataForSearchPosition.value + dataForSearchPosition.step)));

    if (dataForSearchPosition.elementName === 'first') {
      if (dataForSearchPosition.rangeStatus) {
        if (checkingMaximumForHandleWithIntervalIncluded) { // проверка максимума для первого элемента при включенном интервале
          currentPositionHandle = currentPositionHandleRange;
          valueTip = dataForSearchPosition.valueRange - dataForSearchPosition.step;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex);
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      } else {
        if (checkingMaximumForHandleWithIntervalTurnedOff) { // проверка максимума для первого элемента при ВЫКЛюченном интервале
          currentPositionHandle = dataForSearchPosition.sliderWidth;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex);
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      }
      this.pluginOptions.value = valueTip;
    } else if (dataForSearchPosition.elementName === 'second') {
      if (checkingMaximumForHandleRange) { // проверка максимума второго элемента
        currentPositionHandleRange = dataForSearchPosition.sliderWidth;
      } else if (checkingMinimumForHandleRange) { // проверка минимума второго элемента
        currentPositionHandleRange = widthOfstep * arrayOfPosition.indexOf(dataForSearchPosition.value + dataForSearchPosition.step);
        valueTip = dataForSearchPosition.value + dataForSearchPosition.step;
      } else if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
      this.pluginOptions.valueRange = valueTip;
    }
    const dataWhenMoving = { currentPositionHandle, elementName: dataForSearchPosition.elementName, valueTip };
    dataWhenMoving.type = 'model';

    const dataForUpdateViewPanel = this.pluginOptions;
    dataForUpdateViewPanel.type = 'model';

    this.notify('sendPositionWhenMoving', dataWhenMoving);
    this.notify('updateViewPanel', dataForUpdateViewPanel);
  }
}

export default Model;

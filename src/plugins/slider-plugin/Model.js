import EventEmitter from './eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();
    this.data = {
      $slider: options.slider,
      showConfigPanel: options.showConfigPanel,
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      handleValueHide: options.handleValueHide,
      verticalOrientation: options.verticalOrientation,
      rangeStatus: options.rangeStatus,
    };
    this.validation();
  }
  validation() {
    this.data.showConfigPanel = Boolean(this.data.showConfigPanel) || false;
    this.data.minimum = Number(this.data.minimum) || 1;
    this.data.maximum = Number(this.data.maximum) || 10;
    this.data.value = Number(this.data.value) || this.data.minimum;
    this.data.valueRange = Number(this.data.valueRange) || this.data.maximum;
    this.data.step = Number(this.data.step) || 1;
    this.data.handleValueHide = Boolean(this.data.handleValueHide) || false;
    this.data.verticalOrientation = Boolean(this.data.verticalOrientation) || false;
    this.data.rangeStatus = Boolean(this.data.rangeStatus) || false;

    if (this.data.minimum >= this.data.maximum) {
      this.data.minimum = 1;
      this.data.maximum = 10;
      console.log('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
    }
    const validateStepValue = (this.data.step < 1 || this.data.step > (this.data.maximum - this.data.minimum));
    if (validateStepValue) {
      this.data.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const valueValidate = this.data.value > this.data.maximum || this.data.value < this.data.minimum;
    if (valueValidate) {
      this.data.value = this.data.minimum;
      this.data.valueRange = this.data.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (this.data.rangeStatus) {
      const valueRangeValidate = this.data.valueRange > this.data.maximum;
      if (valueRangeValidate) {
        this.data.value = this.data.minimum;
        this.data.valueRange = this.data.maximum;
        console.log('Неккоректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
      }
      if (this.data.value >= this.data.valueRange) {
        this.data.valueRange = this.data.value;
        this.data.value -= this.data.step;
        console.log('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
      }
    }
  }

  getData() {
    this.notify('updateViewSlider', this.data);
    this.notify('updateViewPanel', this.data);
  }
  updateData(data) {
    this.data.showConfigPanel = data.showConfigPanel;
    this.data.minimum = data.minimum;
    this.data.maximum = data.maximum;
    this.data.value = data.value;
    this.data.valueRange = data.valueRange;
    this.data.step = data.step;
    this.data.handleValueHide = data.handleValueHide;
    this.data.verticalOrientation = data.verticalOrientation;
    this.data.rangeStatus = data.rangeStatus;
    this.validation();
    this.notify('updateViewSlider', this.data);
    this.notify('updateViewPanel', this.data);
  }

  calculateDefaultPosition({ minimum, maximum, value, elementName, step, scaleWidth }) { // установка ползунка в позицию "по-умолчанию" = value
    const defaultValuesArray = [];
    let currentValue = 0;

    if (value <= minimum) {
      value = minimum;
    } else if (value >= maximum) {
      value = maximum;
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
    const currentIndexDefaultPosition = defaultValuesArray.indexOf(value);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (elementName === 'first') {
      this.data.value = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.data.value = defaultValuesArray[0];
      }
    } else if (elementName === 'second') {
      this.data.valueRange = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.data.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
    }

    this.notify('returnDefaultPosition', { defaultPosition, elementName, value });
  }

  calculateValue(minimum, maximum, step, sliderWidth, clickCoordinatesInsideTheHandle, rangeStatus, valueRange) { // расчет значения над ползунком
    const values = [];
    let currentValue = 0;
    while (currentValue < maximum) {
      if (minimum > maximum) {
        break;
      } else {
        currentValue = minimum;
        minimum += step;
        values.push(currentValue);
      }
    }
    const valueStep = sliderWidth / (values[values.length - 1] - values[0]);
    const calculateValue = ((clickCoordinatesInsideTheHandle + (valueStep / 2)) / valueStep) ^ 0;

    const checkingTheValueWhenMoving = rangeStatus && (calculateValue >= values.indexOf(valueRange - step)); // проверка значения при движении левого ползунка
    let newValue;
    if (rangeStatus) {
      newValue = values[calculateValue] || values[values.length - 1];
    } else {
      if (checkingTheValueWhenMoving) {
        newValue = (valueRange - step);
      } else {
        newValue = values[calculateValue] || values[values.length - 1];
      }
    }
    return newValue;
  }

  moveHandleOnClick({ data, sliderWidth, clickCoordinatesInsideTheHandle, positionFirstHandle, positionSecondHandle }) { // обработка клика по шкале слайдера
    const arrayPositionAtClick = this.createArrayOfPosition(null, data);

    const valueStepOnClick = (sliderWidth / ((arrayPositionAtClick[arrayPositionAtClick.length - 1] - arrayPositionAtClick[0]) / data.step));
    let moveToPosition;
    const calculateValue = ((clickCoordinatesInsideTheHandle + (valueStepOnClick / 2)) / valueStepOnClick) ^ 0;
    const clickMiddlePosition = parseInt((valueStepOnClick * calculateValue) + (valueStepOnClick / 2));

    if (clickCoordinatesInsideTheHandle < clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue);
    } else if (clickCoordinatesInsideTheHandle > clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue) + valueStepOnClick;
    }

    if (moveToPosition > sliderWidth) {
      moveToPosition = sliderWidth;
    }

    const newValue = this.calculateValue(data.minimum, data.maximum, data.step, sliderWidth, clickCoordinatesInsideTheHandle / data.step, data.rangeStatus, data.valueRange);

    const checkPositionForHandleElem = ((clickCoordinatesInsideTheHandle - positionFirstHandle) > (positionSecondHandle - clickCoordinatesInsideTheHandle));
    const checkPositionForHandleElemRange = ((clickCoordinatesInsideTheHandle - positionFirstHandle) < (positionSecondHandle - clickCoordinatesInsideTheHandle));

    if (data.rangeStatus) { // если интервал включен
      if (clickCoordinatesInsideTheHandle < positionFirstHandle) { // если новая позиция < позиции первого элемента
        data.value = parseInt(newValue);
      } else if (clickCoordinatesInsideTheHandle > positionSecondHandle) { // если новая позиция > позиции второго элемента
        if (clickCoordinatesInsideTheHandle > sliderWidth) {
          data.valueRange = parseInt(data.maximum);
        } else {
          data.valueRange = parseInt(newValue);
        }
      } else { // если новая позиция между элементами
        if (checkPositionForHandleElem) { // если клик между элементами ближе ко второму элементу
          data.valueRange = parseInt(newValue);
        } else if (checkPositionForHandleElemRange) { // если клик между элементами ближе к первому элементу
          data.value = parseInt(newValue);
        }
      }
    } else { // если интервал ВЫКЛючен
      data.value = parseInt(newValue);
    }
    this.updateData(data);
  }
  createArrayOfPosition(elementName, data) {
    let currentValue = 0;
    let arrMin = data.minimum;
    let arrMax = data.maximum;
    const position = [];
    if (elementName && elementName === 'first') {
      arrMax = data.valueRange - data.step;
    }
    while (currentValue < arrMax) {
      if (arrMin > arrMax) {
        break;
      } else {
        currentValue = arrMin;
        arrMin += data.step;
        position.push(currentValue);
      }
    }
    return position;
  }

  searchPositionWhenMoving({ coordinatesInsideTheSlider, sliderWidth, elementName, data }) {
    const ArrayOfPosition = this.createArrayOfPosition(null, data);
    const ArrayOfPositionRange = this.createArrayOfPosition(elementName, data);

    if (coordinatesInsideTheSlider < 0) {
      coordinatesInsideTheSlider = 0;
    }
    if (coordinatesInsideTheSlider > sliderWidth) {
      coordinatesInsideTheSlider = sliderWidth;
    }

    let valueTip = this.calculateValue(data.minimum, data.maximum, data.step, sliderWidth, coordinatesInsideTheSlider, data.rangeStatus, data.valueRange);

    const widthOfstep = (sliderWidth / (ArrayOfPosition.length - 1)); // ширина шага
    const halfWidthOfStep = (widthOfstep / 2); // половина щирины шага

    const currentIndex = ArrayOfPosition.indexOf(data.value); // индекс первого значения в массиве ArrayOfPosition
    let currentPositionHandle = widthOfstep * currentIndex; // текущая позиция первого элемента

    const currentIndexRange = ArrayOfPositionRange.indexOf(data.valueRange - data.step);// индекс второго значения в массиве ArrayOfPositionRange
    let currentPositionHandleRange = widthOfstep * currentIndexRange;// текущая позиция второго элемента

    const currentPositionCursor = coordinatesInsideTheSlider * data.step; // текущее положение курсора внутри слайдера???
    const middleOfPosition = currentPositionHandle + halfWidthOfStep; // расстояние в пол шага справа от первого элемента
    const checkMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (ArrayOfPositionRange.length - 1)) || currentIndexRange === -1);
    const checkMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (ArrayOfPosition.length - 1)) || currentIndex === -1);
    const checkMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (ArrayOfPosition.length - 1)) || data.valueRange === -1);
    const checkMinimumForHandleRange = (currentPositionCursor <= (widthOfstep * ArrayOfPosition.indexOf(data.value + data.step)));

    if (elementName === 'first') {
      if (data.rangeStatus) {
        if (checkMaximumForHandleWithIntervalIncluded) { // проверка максимума для первого элемента при включенном интервале
          currentPositionHandle = currentPositionHandleRange;
          valueTip = data.valueRange - data.step;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      } else {
        if (checkMaximumForHandleWithIntervalTurnedOff) { // проверка максимума для первого элемента при ВЫКЛюченном интервале
          currentPositionHandle = sliderWidth;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      }
      data.value = valueTip;
    } else if (elementName === 'second') {
      if (checkMaximumForHandleRange) { // проверка максимума второго элемента
        currentPositionHandleRange = sliderWidth;
      } else if (checkMinimumForHandleRange) { // проверка минимума второго элемента
        currentPositionHandleRange = widthOfstep * ArrayOfPosition.indexOf(data.value + data.step);
        valueTip = data.value + data.step;
      } else if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
      data.valueRange = valueTip;
    }
    this.notify('sendPositionWhenMoving', { currentPositionHandle, elementName, valueTip });
    this.notify('updateViewPanel', this.data);
  }
}

export default Model;

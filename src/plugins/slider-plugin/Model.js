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

  calculateDefaultPosition({ minimum, maximum, value, element, step, scaleWidth }) { // установка ползунка в позицию "по-умолчанию" = value
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

    if (element === 'first') {
      this.data.value = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.data.value = defaultValuesArray[0];
      }
    } else if (element === 'second') {
      this.data.valueRange = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.data.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
    }

    this.notify('returnDefaultPosition', { defaultPosition, element, value });
  }

  calculateValue(minimum, maximum, step, sliderWidth, positionCursorClick, rangeStatus, valueRange) { // расчет значения над ползунком
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
    const calculateValue = ((positionCursorClick + (valueStep / 2)) / valueStep) ^ 0;

    const checkingTheValueWhenMoving = rangeStatus && (calculateValue >= values.indexOf(valueRange - step)); // проверка значения при движении левого ползунка
    let newValue;
    if (rangeStatus) {
      newValue = values[calculateValue];
    } else {
      if (checkingTheValueWhenMoving) {
        newValue = (valueRange - step);
      } else {
        newValue = values[calculateValue];
      }
    }
    return newValue;
  }

  moveHandleOnClick({ data, sliderWidth, positionCursorClick, positionFirstElement, positionSecondElement }) { // обработка клика по шкале слайдера
    const clickPositionArray = [];
    let clickPositionValue = 0;
    let min = data.minimum;
    const max = data.maximum;

    while (clickPositionValue < max) {
      if (min > max) {
        break;
      } else {
        clickPositionValue = min;
        min += data.step;
        clickPositionArray.push(clickPositionValue);
      }
    }

    const valueStepOnClick = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / data.step));
    let moveToPosition;
    const calculateValue = ((positionCursorClick + (valueStepOnClick / 2)) / valueStepOnClick) ^ 0;
    const clickMiddlePosition = parseInt((valueStepOnClick * calculateValue) + (valueStepOnClick / 2));

    if (positionCursorClick < clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue);
    } else if (positionCursorClick > clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue) + valueStepOnClick;
    }

    if (moveToPosition > sliderWidth) {
      moveToPosition = sliderWidth;
    }

    const newValue = this.calculateValue(data.minimum, data.maximum, data.step, sliderWidth, positionCursorClick / data.step, data.rangeStatus, data.valueRange);

    const checkPositionForHandleElem = ((positionCursorClick - positionFirstElement) > (positionSecondElement - positionCursorClick));
    const checkPositionForHandleElemRange = ((positionCursorClick - positionFirstElement) < (positionSecondElement - positionCursorClick));

    if (data.rangeStatus) { // если интервал включен
      if (positionCursorClick < positionFirstElement) { // если новая позиция < позиции первого элемента
        data.value = parseInt(newValue);
      } else if (positionCursorClick > positionSecondElement) { // если новая позиция > позиции второго элемента
        if (positionCursorClick > sliderWidth) {
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

  searchPositionWhenMoving({ beginEdge, endEdge, element, data }) {
    let currentValue = 0;
    let slMin = data.minimum;
    let slMax = data.maximum;
    const position = [];
    while (currentValue < slMax) {
      if (slMin > slMax) {
        break;
      } else {
        currentValue = slMin;
        slMin += data.step;
        position.push(currentValue);
      }
    }

    slMin = data.minimum;
    currentValue = 0;
    const positionRange = [];
    if (element === 'first') {
      slMax = data.valueRange - data.step;
    }
    while (currentValue < slMax) {
      if (slMin > slMax) {
        break;
      } else {
        currentValue = slMin;
        slMin += data.step;
        positionRange.push(currentValue);
      }
    }
    if (beginEdge < 0) {
      beginEdge = 0;
    }
    if (beginEdge > endEdge) {
      beginEdge = endEdge;
    }

    let valueTip = this.calculateValue(data.minimum, data.maximum, data.step, endEdge, beginEdge, data.rangeStatus, data.valueRange);

    const widthOfstep = (endEdge / (position.length - 1)); // ширина шага
    const halfWidthOfStep = (widthOfstep / 2); // половина щирины шага

    const currentIndex = position.indexOf(data.value); // индекс первого значения в массиве position
    let currentPositionHandle = widthOfstep * currentIndex; // текущая позиция первого элемента

    const currentIndexRange = positionRange.indexOf(data.valueRange - data.step);// индекс второго значения в массиве positionRange
    let currentPositionHandleRange = widthOfstep * currentIndexRange;// текущая позиция второго элемента

    const currentPositionCursor = beginEdge * data.step; // текущее положение курсора внутри слайдера???
    const middleOfPosition = currentPositionHandle + halfWidthOfStep; // расстояние в пол шага справа от первого элемента
    const checkMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (positionRange.length - 1)) || currentIndexRange === -1);
    const checkMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex === -1);
    const checkMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || data.valueRange === -1);
    const checkMinimumForHandleRange = (currentPositionCursor <= (widthOfstep * position.indexOf(data.value + data.step)));

    if (element === 'first') {
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
          currentPositionHandle = endEdge;
        } else {
          if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      }
      data.value = valueTip;
    } else if (element === 'second') {
      if (checkMaximumForHandleRange) { // проверка максимума второго элемента
        currentPositionHandleRange = endEdge;
      } else if (checkMinimumForHandleRange) { // проверка минимума второго элемента
        currentPositionHandleRange = widthOfstep * position.indexOf(data.value + data.step);
        valueTip = data.value + data.step;
      } else if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
      data.valueRange = valueTip;
    }
    this.notify('sendPositionWhenMoving', { currentPositionHandle, element, valueTip });
    this.notify('updateViewPanel', this.data);
  }
}

export default Model;

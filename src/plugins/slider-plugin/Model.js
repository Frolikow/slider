import EventEmitter from './eventEmiter';

class Model extends EventEmitter {
  initState(options) {
    this.inputValuesValidation(options);
    const dataForRender = {
      slider: options.slider,
      showConfigPanel: options.showConfigPanel || false,
      minimum: options.minimum || 1,
      maximum: options.maximum || 10,

      value: options.value || this.minimum,
      valueRange: options.valueRange || this.maximum,
      step: options.step || 1,

      handleValueHide: options.handleValueHide || false,
      verticalOrientation: options.verticalOrientation || false,
      rangeStatus: options.rangeStatus || false,
    };
    this.notify('updateViewSlider', dataForRender);
    this.notify('updateViewConfig', dataForRender);
  }
  inputValuesValidation(options) {
    if (options.minimum >= options.maximum) {
      options.minimum = 1;
      options.maximum = 10;
      console.log('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
    }
    const validateStepValue = (options.step < 1 || options.step > (options.maximum - options.minimum)); // проверка корректности значения шага слайдера
    if (validateStepValue) {
      options.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const valueValidate = options.value > options.maximum || options.value < options.minimum;
    if (valueValidate) {
      options.value = options.minimum;
      options.valueRange = options.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    const valueRangeValidate = options.valueRange > options.maximum;
    if (valueRangeValidate) {
      options.value = options.minimum;
      options.valueRange = options.maximum;
      console.log('Неккоректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (options.value >= options.valueRange) {
      options.valueRange = options.value;
      options.value -= options.step;
      console.log('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
    }
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

    if (element === 'first') {
      if (defaultValuesArray.indexOf(value) === -1) {
        value = minimum;
      }
    } else if (element === 'second') {
      if (defaultValuesArray.indexOf(value) === -1) {
        value = maximum;
      }
    }

    const stepOfDefaultPosition = scaleWidth / (defaultValuesArray.length - 1);
    const currentIndexDefaultPosition = defaultValuesArray.indexOf(value);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (element === 'first') {
      this.value = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.value = defaultValuesArray[0];
      }
    } else if (element === 'second') {
      this.valueRange = value;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
    }
    this.notify('returnDefaultPosition', { defaultPosition, element });
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
      if (calculateValue <= values.indexOf(this.value)) {
        newValue = (calculateValue + step);
      } else {
        newValue = values[calculateValue];
      }
    } else {
      if (checkingTheValueWhenMoving) {
        newValue = (valueRange - step);
      } else {
        newValue = values[calculateValue];
      }
    }
    return newValue;
  }

  moveHandleOnClick({ minimum, maximum, step, sliderWidth, positionCursorClick, rangeStatus, valueRange }) { // обработка клика по шкале слайдера
    const clickPositionArray = [];
    let clickPositionValue = 0;
    let min = minimum;
    const max = maximum;

    while (clickPositionValue < max) {
      if (min > max) {
        break;
      } else {
        clickPositionValue = min;
        min += step;
        clickPositionArray.push(clickPositionValue);
      }
    }

    const valueStepOnClick = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / step));
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
    const newValue = this.calculateValue(minimum, maximum, step, sliderWidth, positionCursorClick / step, rangeStatus, valueRange);

    this.notify('updateAfterClickOnSlider', { positionCursorClick, moveToPosition, newValue, sliderWidth });
  }

  // не сделано
  searchPositionWhenMoving({ beginEdge, endEdge, position, positionRange, testElement, value, valueRange, step, rangeStatus, minimum, maximum }) {
    let valueTip = this.calculateValue(minimum, maximum, step, endEdge, beginEdge, rangeStatus, valueRange);

    const widthOfstep = (endEdge / (position.length - 1)); // ширина шага
    const halfWidthOfStep = (widthOfstep / 2); // половина щирины шага

    const currentIndex = position.indexOf(value); // индекс первого значения в массиве position
    let currentPositionHandle = widthOfstep * currentIndex; // текущая позиция первого элемента

    const currentIndexRange = positionRange.indexOf(valueRange - step);// индекс второго значения в массиве positionRange
    let currentPositionHandleRange = widthOfstep * currentIndexRange;// текущая позиция второго элемента

    const currentPositionCursor = beginEdge * step; // текущее положение курсора внутри слайдера???
    const middleOfPosition = currentPositionHandle + halfWidthOfStep; // расстояние в пол шага справа от первого элемента

    const checkMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (positionRange.length - 1)) || currentIndexRange === -1);
    const checkMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex === -1);
    const checkMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || valueRange === -1);
    const checkMinimumForHandleRange = (currentPositionCursor <= (widthOfstep * position.indexOf(value + step)));

    if (testElement === 'first') {
      if (rangeStatus) {
        if (checkMaximumForHandleWithIntervalIncluded) { // проверка максимума для первого элемента при включенном интервале
          currentPositionHandle = currentPositionHandleRange;
          valueTip = valueRange - step;
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
    } else if (testElement === 'second') {
      if (checkMaximumForHandleRange) { // проверка максимума второго элемента
        currentPositionHandleRange = endEdge;
      } else if (checkMinimumForHandleRange) { // проверка минимума второго элемента
        currentPositionHandleRange = widthOfstep * position.indexOf(value + step);
        valueTip = value + step;
      } else if (currentPositionCursor <= middleOfPosition) { // если положение курсора меньше или равно  middleOfPosition
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) { // если положение курсора больше  middleOfPosition
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
    }
    this.notify('sendPositionWhenMoving', { currentPositionHandle, testElement, valueTip });
  }
}

export default Model;

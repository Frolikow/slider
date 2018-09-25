import $ from 'jquery';

class Model {
  constructor(options) {
    this.showConfigPanel = options.showConfigPanel || false;
    this.minimum = options.minimum || 1;
    this.maximum = options.maximum || 10;
    this.value = options.value || this.minimum;
    this.valueRange = options.valueRange || this.maximum;
    this.step = options.step || 1;
    this.verticalOrientation = options.verticalOrientation || false;
    this.rangeStatus = options.rangeStatus || false;
    this.handleValueHide = options.handleValueHide || false;
    this.inputValidation();
  }

  inputValidation() {
    const validateStepValue = (this.step < 1 || this.step > (this.maximum - this.minimum)); // проверка корректности значения шага слайдера

    if (this.minimum > this.maximum) {
      this.minimum = 1;
      this.maximum = 10;
      alert('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \n Изменено на minimum = 1, maximum = 10.');
    }
    if (validateStepValue) {
      this.step = 1;
      alert('Неккоректное значение step \nОбязательное условие: \nstep >=1 || step <= (maximum - minimum) \n Изменено на step = 1.');
    }
    if (this.value > this.valueRange) {
      this.valueRange = this.value;
      this.value = this.value - this.step;
      alert('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \n Изменено на value = value - step, valueRange = value.');
    }
  }

  createHandleRange() {
    if (this.rangeStatus) {
      this.$configCurrentValueElem.attr('max', (this.valueRange - this.step));
      this.$handleElemRange.removeClass('slider__handle_hidden');
      this.$configCurrentValueRangeElem.removeClass('configuration__current-value-range_hidden');
      this.$handleElemRange.addClass('slider__handle_visible');
      this.$configCurrentValueRangeElem.addClass('configuration__current-value-range_visible');
      this.$configCurrentValueRangeElem.val(this.valueRange);
      this.$valueElemRange.text(this.valueRange);
      if (this.value >= this.valueRange) {
        this.valueRange = this.value;
        this.value = this.valueRange - this.step;
        this.$handleElem.css('left', this.calculateDefaultValue(this.maximum, this.minimum, this.value, this.$valueElem));
        this.$handleElemRange.css('left', this.calculateDefaultValue(this.maximum, this.minimum, this.valueRange, this.$valueElemRange));
      } else {
        this.$handleElemRange.css('left', this.calculateDefaultValue(this.maximum, this.minimum, this.valueRange, this.$valueElemRange));
      }
    } else {
      this.$handleElemRange.removeClass('slider__handle_visible');
      this.$configCurrentValueRangeElem.removeClass('configuration__current-value-range_visible');
      this.$handleElemRange.addClass('slider__handle_hidden');
      this.$configCurrentValueRangeElem.addClass('configuration__current-value-range_hidden');
      this.$configCurrentValueElem.attr('max', this.maximum);
    }
  }

  calculateDefaultValue(slMax, slMin, slVal, currentElem) { // установка ползунка в позицию "по-умолчанию" = value
    const defaultValuesArray = [];
    let currentValue = 0;

    if (slVal <= slMin) {
      slVal = slMin;
    } else if (slVal >= slMax) {
      slVal = slMax;
    }

    let defaultMinimum = slMin;
    while (currentValue < slMax) {
      if (defaultMinimum > slMax) {
        break;
      } else {
        currentValue = defaultMinimum;
        defaultMinimum += this.step;
        defaultValuesArray.push(currentValue);
      }
    }

    if (currentElem === this.$valueElem) {
      if (($.inArray(this.value, defaultValuesArray)) === -1) {
        slVal = slMin;
      }
    } else if (currentElem === this.$valueElemRange) {
      if (($.inArray(this.valueRange, defaultValuesArray)) === -1) {
        slVal = slMax;
      }
    }
    const sliderWidth = this.$sliderElem.outerWidth() - this.$handleElem.outerWidth();
    const stepOfDefaultPosition = sliderWidth / (defaultValuesArray.length - 1);
    const currentIndexDefaultPosition = $.inArray(slVal, defaultValuesArray);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (currentElem === this.$valueElem) {
      this.value = slVal;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.value = defaultValuesArray[0];
      }
      currentElem.html(this.value);
      this.$configCurrentValueElem.val(this.value);
    } else if (currentElem === this.$valueElemRange) {
      this.valueRange = slVal;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.valueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
      currentElem.html(this.valueRange);
      this.$configCurrentValueRangeElem.val(this.valueRange);
    }
    return defaultPosition;
  }

  calculateValue(slMax, slMin, begin, rangeStatus) { // расчет значения над ползунком
    const sliderWidth = this.$sliderElem.outerWidth() - this.$handleElem.outerWidth();
    const values = [];
    let currentValue = 0;
    while (currentValue < slMax) {
      if (slMin > slMax) {
        break;
      } else {
        currentValue = slMin;
        slMin += this.step;
        values.push(currentValue);
      }
    }
    const valueStep = sliderWidth / (values[values.length - 1] - values[0]);
    const calculateValue = ((begin + (valueStep / 2)) / valueStep) ^ 0;

    const checkingTheValueWhenMoving = (this.rangeStatus && calculateValue) >= $.inArray((this.valueRange - this.step), values); // проверка значения при движении левого ползунка

    if (rangeStatus) {
      if (calculateValue <= $.inArray(this.value, values)) {
        this.$valueElemRange.html(this.value + this.step);
        this.valueRange = parseInt(this.$valueElemRange.text());
        this.$configCurrentValueRangeElem.val(this.value + this.step);
      } else {
        this.$valueElemRange.html(values[calculateValue]);
        this.valueRange = parseInt(this.$valueElemRange.text());
        this.$configCurrentValueRangeElem.val(this.valueRange);
      }
    } else {
      if (checkingTheValueWhenMoving) {
        this.$valueElem.html(this.valueRange - this.step);
        this.value = parseInt(this.$valueElem.text());
        this.$configCurrentValueElem.val(this.valueRange - this.step);
      } else {
        this.$valueElem.html(values[calculateValue]);
        this.value = parseInt(this.$valueElem.text());
        this.$configCurrentValueElem.val(this.value);
      }
    }
  }

  getCoords(elem) { // получение координат курсора внутри элемента
    const box = elem.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  clickOnSlider(event) { // обработка клика ЛКМ по шкале слайдера
    const clickPositionArray = [];
    let clickPositionValue = 0;
    let slMin = this.minimum;
    const slMax = this.maximum;
    while (clickPositionValue < slMax) {
      if (slMin > slMax) {
        break;
      } else {
        clickPositionValue = slMin;
        slMin += this.step;
        clickPositionArray.push(clickPositionValue);
      }
    }

    let shift;
    const sliderCoords = this.getCoords(this.$sliderElem); // внутренние координаты слайдера
    if (this.verticalOrientation) {
      shift = (event.pageY - sliderCoords.top - (this.$handleElem.outerHeight() / 2));
    } else {
      shift = (event.pageX - sliderCoords.left - (this.$handleElem.outerWidth() / 2));
    }

    const sliderWidth = this.$sliderElem.outerWidth() - this.$handleElem.outerWidth();
    const valueStepOnClick = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / this.step));

    let moveToPosition;
    const calculateValue = ((shift + (valueStepOnClick / 2)) / valueStepOnClick) ^ 0;
    const clickMiddlePosition = parseInt((valueStepOnClick * calculateValue) + (valueStepOnClick / 2));

    if (shift < clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue);
    } else if (shift > clickMiddlePosition) {
      moveToPosition = (valueStepOnClick * calculateValue) + valueStepOnClick;
    }

    if (moveToPosition > sliderWidth) {
      moveToPosition = sliderWidth;
    }

    const checkPositionHandleForHandleElem = ((moveToPosition - parseInt(this.$handleElem.css('left'))) > (parseInt(this.$handleElemRange.css('left')) - moveToPosition));
    const checkPositionHandleForHandleElemRange = ((moveToPosition - parseInt(this.$handleElem.css('left'))) < (parseInt(this.$handleElemRange.css('left')) - moveToPosition));

    if (this.rangeStatus) {
      if (moveToPosition < parseInt(this.$handleElem.css('left'))) {
        this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateValue(this.maximum, this.minimum, shift / this.step, false));
      } else if (moveToPosition > parseInt(this.$handleElemRange.css('left'))) {
        this.$handleElemRange.animate({ left: `${moveToPosition}px` }, 300, this.calculateValue(this.maximum, this.minimum, shift / this.step, true));
      } else {
        if (checkPositionHandleForHandleElem) {
          this.$handleElemRange.animate({ left: `${moveToPosition}px` }, 300, this.calculateValue(this.maximum, this.minimum, shift / this.step, true));
        } else if (checkPositionHandleForHandleElemRange) {
          this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateValue(this.maximum, this.minimum, shift / this.step, false));
        }
      }
    } else {
      this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateValue(this.maximum, this.minimum, shift / this.step, false));
    }
  }

  mouseDown(event, $actualElement) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.$sliderElem); // внутренние координаты слайдера
    const handleCoords = this.getCoords($actualElement); // внутренние координаты ползунка
    let shift; // координаты левого края элемента
    if (this.verticalOrientation === true) {
      shift = event.pageY - handleCoords.top;
    } else {
      shift = event.pageX - handleCoords.left;
    }
    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let beginEdge;
      const position = [];
      let currentValue = 0;
      let slMin = this.minimum;
      let slMax = this.maximum;
      while (currentValue < slMax) {
        if (slMin > slMax) {
          break;
        } else {
          currentValue = slMin;
          slMin += this.step;
          position.push(currentValue);
        }
      }

      const positionRange = [];
      slMin = this.minimum;
      currentValue = 0;
      if ($actualElement === this.$handleElem) {
        slMax = this.valueRange - this.step;
      }
      while (currentValue < slMax) {
        if (slMin > slMax) {
          break;
        } else {
          currentValue = slMin;
          slMin += this.step;
          positionRange.push(currentValue);
        }
      }
      if (this.verticalOrientation) {
        beginEdge = (event.pageY - shift - sliderCoords.top) / this.step;
      } else {
        beginEdge = (event.pageX - shift - sliderCoords.left) / this.step;
      }

      if (beginEdge < 0) {
        beginEdge = 0;
      }
      const endEdge = this.$sliderElem.outerWidth() - $actualElement.outerWidth();
      if (beginEdge > endEdge) {
        beginEdge = endEdge;
      }
      $actualElement.css('left', `${this.searchPosition(beginEdge, endEdge, position, positionRange, $actualElement)}px`);

      if ($actualElement === this.$handleElem) {
        this.calculateValue(this.maximum, this.minimum, beginEdge, false);
      } else if ($actualElement === this.$handleElemRange) {
        this.calculateValue(this.maximum, this.minimum, beginEdge, true);
      }
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }

  searchPosition(begin, end, position, positionRange, $element) {
    const widthOfstep = (end / (position.length - 1));
    const halfWidthOfStep = (widthOfstep / 2);

    const currentIndex = $.inArray(this.value, position);
    let currentPositionHandle = widthOfstep * currentIndex;

    const currentIndexRange = $.inArray(this.valueRange - this.step, positionRange);
    let currentPositionHandleRange = widthOfstep * currentIndexRange;

    const currentPositionCursor = begin * this.step;
    const middleOfPosition = currentPositionHandle + halfWidthOfStep;


    const checkMaximumForHandleWithIntervalIncluded = (currentPositionCursor >= (widthOfstep * (positionRange.length - 1)) || currentIndexRange === -1);
    const checkMaximumForHandleWithIntervalTurnedOff = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex === -1);
    const checkMaximumForHandleRange = (currentPositionCursor >= (widthOfstep * (position.length - 1)) || this.valueRange === -1);
    const checkMinimumForHandleRange = (this.valueRange <= this.value + this.step);

    if ($element === this.$handleElem) {
      if (this.rangeStatus) {
        if (checkMaximumForHandleWithIntervalIncluded) {
          currentPositionHandle = currentPositionHandleRange;
        } else {
          if (currentPositionCursor <= middleOfPosition) {
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) {
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      } else {
        if (checkMaximumForHandleWithIntervalTurnedOff) {
          currentPositionHandle = end;
        } else {
          if (currentPositionCursor <= middleOfPosition) {
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) {
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      }
    } else if ($element === this.$handleElemRange) {
      if (checkMaximumForHandleRange) {
        currentPositionHandleRange = end;
      } else if (checkMinimumForHandleRange) {
        currentPositionHandleRange = widthOfstep * $.inArray((this.value + this.step), position);
      } else if (currentPositionCursor <= middleOfPosition) {
        currentPositionHandleRange = widthOfstep * currentIndexRange;
      } else if (currentPositionCursor > middleOfPosition) {
        currentPositionHandleRange = (widthOfstep * currentIndexRange) + widthOfstep;
      }
      currentPositionHandle = currentPositionHandleRange;
    }
    return currentPositionHandle;
  }
}

export default Model;

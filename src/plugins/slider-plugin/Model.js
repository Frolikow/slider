import $ from 'jquery';

class Model {
  constructor(options) {
    this.sliderConfigPanel = options.sliderConfigPanel || false;
    this.sliderMin = options.sliderMin || 1;
    this.sliderMax = options.sliderMax || 10;
    this.sliderValue = options.sliderValue || this.sliderMin;
    this.sliderValueRange = options.sliderValueRange || this.sliderMax;
    this.sliderStep = options.sliderStep || 1;
    this.verticalOrientation = options.verticalOrientation || false;
    this.sliderRangeStatus = options.sliderRangeStatus || false;
    this.sliderHandleValueHide = options.sliderHandleValueHide || false;
    this.inputValidation();
  }

  inputValidation() {
    if (this.sliderMin > this.sliderMax) {
      this.sliderMin = 1;
      this.sliderMax = 10;
      alert('Неккоректные значения sliderMin, sliderMax \nОбязательное условие: sliderMin < sliderMax \n Изменено на sliderMin = 1, sliderMax = 10.');
    }
    if (this.sliderStep < 0 || this.sliderStep > (this.sliderMax - this.sliderMin)) {
      this.sliderStep = 1;
      alert('Неккоректное значение sliderStep \nОбязательное условие: \n0 > sliderStep || sliderStep > (sliderMax - sliderMin) \n Изменено на sliderStep = 1.');
    }
    if (this.sliderValue > this.sliderValueRange) {
      this.sliderValueRange = this.sliderValue;
      this.sliderValue = this.sliderValue - this.sliderStep;
      alert('Неккоректные значения sliderValue, sliderValueRange \nОбязательное условие: \nsliderValue < sliderValueRange \n Изменено на sliderValue = sliderValue - sliderStep, sliderValueRange = sliderValue.');
    }
  }

  createHandleRange() {
    if (this.sliderRangeStatus) {
      this.$configCurrentValueElem.attr('max', (this.sliderValueRange - this.sliderStep));
      this.$handleElemRange.css('display', 'block');
      this.$configCurrentValueRangeElem.css('display', 'block');
      this.$configCurrentValueRangeElem.val(this.sliderValueRange);
      this.$valueElemRange.text(this.sliderValueRange);
      if (this.sliderValue >= this.sliderValueRange) {
        this.sliderValueRange = this.sliderValue;
        this.sliderValue = this.sliderValueRange - this.sliderStep;
        this.$handleElem.css('left', this.calculateDefaultValue(this.sliderMax, this.sliderMin, this.sliderValue, this.$valueElem));
        this.$handleElemRange.css('left', this.calculateDefaultValue(this.sliderMax, this.sliderMin, this.sliderValueRange, this.$valueElemRange));
      } else {
        this.$handleElemRange.css('left', this.calculateDefaultValue(this.sliderMax, this.sliderMin, this.sliderValueRange, this.$valueElemRange));
      }
      this.$configCurrentValueRangeElem.focusout(function () {
        this.sliderValueRange = parseInt(this.value);
        this.$handleElemRange.css('left', this.calculateDefaultValue(this.sliderMax, this.sliderMin, this.sliderValueRange, this.$valueElemRange));
        this.$valueElemRange.text(this.sliderValueRange);
        this.$configCurrentValueElem.attr('max', (this.sliderValueRange - this.sliderStep));
      });
    } else {
      this.$handleElemRange.css('display', 'none');
      this.$configCurrentValueRangeElem.css('display', 'none');
      this.$configCurrentValueElem.attr('max', this.sliderMax);
    }
  }

  calculateDefaultValue(slMax, slMin, slVal, currentElem) { // установка ползунка в позицию "по-умолчанию" = sliderValue
    const defaultValuesArray = [];
    let currentValue = 0;

    if (slVal <= slMin) {
      slVal = slMin;
    } else if (slVal >= slMax) {
      slVal = slMax;
    }

    let defSliderMin = slMin;
    for (; currentValue < slMax;) {
      if (defSliderMin > slMax) {
        break;
      } else {
        currentValue = defSliderMin;
        defSliderMin += this.sliderStep;
        defaultValuesArray.push(currentValue);
      }
    }

    if (currentElem === this.$valueElem) {
      if (($.inArray(this.sliderValue, defaultValuesArray)) === -1) {
        slVal = slMin;
      }
    } else if (currentElem === this.$valueElemRange) {
      if (($.inArray(this.sliderValueRange, defaultValuesArray)) === -1) {
        slVal = slMax;
      }
    }
    const sliderWidth = this.$sliderElem.outerWidth() - this.$handleElem.outerWidth();
    const stepOfDefaultPosition = sliderWidth / (defaultValuesArray.length - 1);
    const currentIndexDefaultPosition = $.inArray(slVal, defaultValuesArray);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (currentElem === this.$valueElem) {
      this.sliderValue = slVal;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = 0;
        this.sliderValue = defaultValuesArray[0];
      }
      currentElem.html(this.sliderValue);
      this.$configCurrentValueElem.val(this.sliderValue);
    } else if (currentElem === this.$valueElemRange) {
      this.sliderValueRange = slVal;
      if (currentIndexDefaultPosition === -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        this.sliderValueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
      currentElem.html(this.sliderValueRange);
      this.$configCurrentValueRangeElem.val(this.sliderValueRange);
    }
    return defaultPosition;
  }

  calculateSliderValue(slMax, slMin, begin, rangeStatus) { // расчет значения над ползунком
    const sliderWidth = this.$sliderElem.outerWidth() - this.$handleElem.outerWidth();
    const values = [];
    let currentValue = 0;
    for (; currentValue < slMax;) {
      if (slMin > slMax) {
        break;
      } else {
        currentValue = slMin;
        slMin += this.sliderStep;
        values.push(currentValue);
      }
    }
    const sliderValueStep = sliderWidth / (values[values.length - 1] - values[0]);
    const currentSliderValue = ((begin + (sliderValueStep / 2)) / sliderValueStep) ^ 0;

    if (rangeStatus) {
      if (currentSliderValue <= $.inArray(this.sliderValue, values)) {
        this.$valueElemRange.html(this.sliderValue + this.sliderStep);
        this.sliderValueRange = parseInt(this.$valueElemRange.text());
        this.$configCurrentValueRangeElem.val(this.sliderValue + this.sliderStep);
      } else {
        this.$valueElemRange.html(values[currentSliderValue]);
        this.sliderValueRange = parseInt(this.$valueElemRange.text());
        this.$configCurrentValueRangeElem.val(this.sliderValueRange);
      }
    } else {
      if (this.sliderRangeStatus && currentSliderValue >= $.inArray((this.sliderValueRange - this.sliderStep), values)) {
        this.$valueElem.html(this.sliderValueRange - this.sliderStep);
        this.sliderValue = parseInt(this.$valueElem.text());
        this.$configCurrentValueElem.val(this.sliderValueRange - this.sliderStep);
      } else {
        this.$valueElem.html(values[currentSliderValue]);
        this.sliderValue = parseInt(this.$valueElem.text());
        this.$configCurrentValueElem.val(this.sliderValue);
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
    let slMin = this.sliderMin;
    const slMax = this.sliderMax;
    for (; clickPositionValue < slMax;) {
      if (slMin > slMax) {
        break;
      } else {
        clickPositionValue = slMin;
        slMin += this.sliderStep;
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
    const clickSliderValueStep = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / this.sliderStep));

    // debugger;
    let moveToPosition;
    const currentSliderValue = ((shift + (clickSliderValueStep / 2)) / clickSliderValueStep) ^ 0;
    const clickMiddlePosition = parseInt((clickSliderValueStep * currentSliderValue) + (clickSliderValueStep / 2));

    if (shift < clickMiddlePosition) {
      moveToPosition = (clickSliderValueStep * currentSliderValue);
    } else if (shift > clickMiddlePosition) {
      moveToPosition = (clickSliderValueStep * currentSliderValue) + clickSliderValueStep;
    }

    if (moveToPosition > sliderWidth) {
      moveToPosition = sliderWidth;
    }

    if (this.sliderRangeStatus) {
      if (moveToPosition < parseInt(this.$handleElem.css('left'))) {
        this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateSliderValue(this.sliderMax, this.sliderMin, shift / this.sliderStep, false));
      } else if (moveToPosition > parseInt(this.$handleElemRange.css('left'))) {
        this.$handleElemRange.animate({ left: `${moveToPosition}px` }, 300, this.calculateSliderValue(this.sliderMax, this.sliderMin, shift / this.sliderStep, true));
      } else {
        if ((moveToPosition - parseInt(this.$handleElem.css('left'))) > (parseInt(this.$handleElemRange.css('left')) - moveToPosition)) {
          this.$handleElemRange.animate({ left: `${moveToPosition}px` }, 300, this.calculateSliderValue(this.sliderMax, this.sliderMin, shift / this.sliderStep, true));
        } else if ((moveToPosition - parseInt(this.$handleElem.css('left'))) < (parseInt(this.$handleElemRange.css('left')) - moveToPosition)) {
          this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateSliderValue(this.sliderMax, this.sliderMin, shift / this.sliderStep, false));
        }
      }
    } else {
      this.$handleElem.animate({ left: `${moveToPosition}px` }, 300, this.calculateSliderValue(this.sliderMax, this.sliderMin, shift / this.sliderStep, false));
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
      let slMin = this.sliderMin;
      let slMax = this.sliderMax;
      for (; currentValue < slMax;) {
        if (slMin > slMax) {
          break;
        } else {
          currentValue = slMin;
          slMin += this.sliderStep;
          position.push(currentValue);
        }
      }

      const positionRange = [];
      slMin = this.sliderMin;
      currentValue = 0;
      if ($actualElement === this.$handleElem) {
        slMax = this.sliderValueRange - this.sliderStep;
      }
      for (; currentValue < slMax;) {
        if (slMin > slMax) {
          break;
        } else {
          currentValue = slMin;
          slMin += this.sliderStep;
          positionRange.push(currentValue);
        }
      }
      if (this.verticalOrientation) {
        beginEdge = (event.pageY - shift - sliderCoords.top) / this.sliderStep;
      } else {
        beginEdge = (event.pageX - shift - sliderCoords.left) / this.sliderStep;
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
        this.calculateSliderValue(this.sliderMax, this.sliderMin, beginEdge, false);
      } else if ($actualElement === this.$handleElemRange) {
        this.calculateSliderValue(this.sliderMax, this.sliderMin, beginEdge, true);
      }
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }

  searchPosition(begin, end, position, positionRange, $element) {
    const widthOfstep = (end / (position.length - 1));
    const halfWidthOfStep = (widthOfstep / 2);

    const currentIndex = $.inArray(this.sliderValue, position);
    let currentPositionHandle = widthOfstep * currentIndex;

    const currentIndexRange = $.inArray(this.sliderValueRange - this.sliderStep, positionRange);
    let currentPositionHandleRange = widthOfstep * currentIndexRange;

    const currentPositionCursor = begin * this.sliderStep;
    const middleOfPosition = currentPositionHandle + halfWidthOfStep;

    if ($element === this.$handleElem) {
      if (this.sliderRangeStatus) {
        if (currentPositionCursor >= (widthOfstep * (positionRange.length - 1)) || currentIndexRange === -1) {
          currentPositionHandle = currentPositionHandleRange;
        } else {
          if (currentPositionCursor <= middleOfPosition) {
            currentPositionHandle = widthOfstep * currentIndex;
          } else if (currentPositionCursor > middleOfPosition) {
            currentPositionHandle = (widthOfstep * currentIndex) + widthOfstep;
          }
        }
      } else {
        if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex === -1) {
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
      if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || this.sliderValueRange === -1) {
        currentPositionHandleRange = end;
      } else if (this.sliderValueRange <= this.sliderValue + this.sliderStep) {
        currentPositionHandleRange = widthOfstep * $.inArray((this.sliderValue + this.sliderStep), position);
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

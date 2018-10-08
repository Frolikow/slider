import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  updateViewSlider({ slider, showConfigPanel, minimum, maximum, value, valueRange, step, handleValueHide, verticalOrientation, rangeStatus }) {
    this.slider = slider;
    this.showConfigPanel = showConfigPanel;
    this.minimum = minimum;
    this.maximum = maximum;

    this.value = value;
    this.valueRange = valueRange;
    this.step = step;

    this.handleValueHide = handleValueHide;
    this.verticalOrientation = verticalOrientation;
    this.rangeStatus = rangeStatus;

    this.render();
  }

  render() {
    this.slider.html(`<div class='slider__element'>
                      <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
                      <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>
                    `);

    this.scaleElement = this.slider.find('.slider__element');
    this.handleFirstElement = this.slider.find('.slider__handle_left');
    this.valueFirstElement = this.slider.find('.slider__value_left');
    this.handleSecondElement = this.slider.find('.slider__handle_right');
    this.valueSecondElement = this.slider.find('.slider__value_right');

    this.handleValueHide ? this.showHandleValue(true) : this.showHandleValue(false);
    this.verticalOrientation ? this.changeOriental(true) : this.changeOriental(false);
    this.rangeStatus ? this.rangeSelection(true) : this.rangeSelection(false);
    this.valuesInTips(this.value, this.valueRange);

    this.defaultPosition(this.minimum, this.maximum, this.value, 'first', this.step);
    if (this.rangeStatus) {
      this.defaultPosition(this.minimum, this.maximum, this.valueRange, 'second', this.step);
    }

    this.scaleElement.click((event) => {
      const sliderWidth = this.scaleElement.outerWidth() - this.handleFirstElement.outerWidth();
      let positionCursorClick;
      const sliderCoords = this.getCoords(this.scaleElement); // внутренние координаты слайдера
      if (this.verticalOrientation) {
        positionCursorClick = (event.pageY - sliderCoords.top - (this.handleFirstElement.outerHeight() / 2));
      } else {
        positionCursorClick = (event.pageX - sliderCoords.left - (this.handleFirstElement.outerWidth() / 2));
      }
      this.notify('clickTheSlider', { minimum: this.minimum, maximum: this.maximum, step: this.step, sliderWidth, positionCursorClick, rangeStatus: this.rangeStatus, valueRange: this.valueRange });
    });

    this.handleFirstElement.mousedown((event) => {
      this.moveHandle({ event, currentElement: this.handleFirstElement });
    });

    this.handleSecondElement.mousedown((event) => {
      this.moveHandle({ event, currentElement: this.handleSecondElement });
    });
  }
  updateAfterClickOnSlider({ positionCursorClick, moveToPosition, newValue, sliderWidth }) {
    const checkPositionForHandleElem = ((positionCursorClick - parseInt(this.handleFirstElement.css('left'))) > (parseInt(this.handleSecondElement.css('left')) - positionCursorClick));
    const checkPositionForHandleElemRange = ((positionCursorClick - parseInt(this.handleFirstElement.css('left'))) < (parseInt(this.handleSecondElement.css('left')) - positionCursorClick));
    if (this.rangeStatus) { // если интервал включен
      if (positionCursorClick < parseInt(this.handleFirstElement.css('left'))) { // если новая позиция < позиции первого элемента
        this.valueFirstElement.html(newValue);
        this.value = parseInt(newValue);
        this.handleFirstElement.animate({ left: `${moveToPosition}px` }, 300);
      } else if (positionCursorClick > parseInt(this.handleSecondElement.css('left'))) { // если новая позиция > позиции второго элемента
        if (positionCursorClick > sliderWidth) {
          this.valueSecondElement.html(this.maximum);
          this.valueRange = parseInt(this.maximum);
          this.handleSecondElement.animate({ left: `${moveToPosition}px` }, 300);
        } else {
          this.valueSecondElement.html(newValue);
          this.valueRange = parseInt(newValue);
          this.handleSecondElement.animate({ left: `${moveToPosition}px` }, 300);
        }
      } else { // если новая позиция между элементами
        if (checkPositionForHandleElem) { // если клик между элементами ближе ко второму элементу
          this.valueSecondElement.html(newValue);
          this.valueRange = parseInt(newValue);
          this.handleSecondElement.animate({ left: `${moveToPosition}px` }, 300);
        } else if (checkPositionForHandleElemRange) { // если клик между элементами ближе к первому элементу
          this.valueFirstElement.html(newValue);
          this.value = parseInt(newValue);
          this.handleFirstElement.animate({ left: `${moveToPosition}px` }, 300);
        }
      }
    } else { // если интервал ВЫКЛючен
      this.valueFirstElement.html(newValue);
      this.value = parseInt(newValue);
      this.handleFirstElement.animate({ left: `${moveToPosition}px` }, 300);
    }
    this.sendDataForViewConfig();
  }
  getCoords(element) { // получение координат курсора внутри элемента
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  moveHandle({ event, currentElement }) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.scaleElement); // внутренние координаты слайдера
    const handleCoords = this.getCoords(currentElement); // внутренние координаты ползунка
    let positionCursorClick; // координаты клика внутри ползунка
    if (this.verticalOrientation === true) {
      positionCursorClick = event.pageY - handleCoords.top;
    } else {
      positionCursorClick = event.pageX - handleCoords.left;
    }
    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let beginEdge; // позиция курсора внутри слайдера
      const endEdge = this.scaleElement.outerWidth() - currentElement.outerWidth();
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
      if (currentElement === this.handleFirstElement) {
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
        beginEdge = (event.pageY - positionCursorClick - sliderCoords.top) / this.step;
      } else {
        beginEdge = (event.pageX - positionCursorClick - sliderCoords.left) / this.step;
      }

      if (beginEdge < 0) {
        beginEdge = 0;
      }
      if (beginEdge > endEdge) {
        beginEdge = endEdge;
      }

      let testElement;
      if (currentElement === this.handleFirstElement) {
        testElement = 'first';
      } else {
        testElement = 'second';
      }
      this.notify('searchPositionWhenMoving', { beginEdge, endEdge, position, positionRange, testElement, value: this.value, valueRange: this.valueRange, step: this.step, rangeStatus: this.rangeStatus, minimum: this.minimum, maximum: this.maximum });
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  getPositionWhenMoving({ currentPositionHandle, testElement, valueTip }) {
    if (testElement === 'first') {
      this.handleFirstElement.css('left', `${currentPositionHandle}px`);
      this.valueFirstElement.html(valueTip);
      this.value = parseInt(valueTip);
    }
    if (testElement === 'second') {
      this.handleSecondElement.css('left', `${currentPositionHandle}px`);
      this.valueSecondElement.html(valueTip);
      this.valueRange = parseInt(valueTip);
    }
    this.sendDataForViewConfig();
  }
  defaultPosition(minimum, maximum, value, element, step) {
    const scaleWidth = this.scaleElement.outerWidth() - this.handleFirstElement.outerWidth();

    const dataForRequestDefaultPosition = { minimum, maximum, value, element, step, scaleWidth };
    this.notify('requestDefaultPosition', dataForRequestDefaultPosition);
  }
  getDefaultPosition({ defaultPosition, element }) {
    if (element === 'first') {
      this.handleFirstElement.css('left', defaultPosition);
    }
    if (element === 'second') {
      this.handleSecondElement.css('left', defaultPosition);
    }
  }
  showHandleValue(value) {
    if (value) {
      this.valueFirstElement.removeClass('slider__value_visible');
      this.valueSecondElement.removeClass('slider__value_visible');
      this.valueFirstElement.addClass('slider__value_hidden');
      this.valueSecondElement.addClass('slider__value_hidden');
    } else {
      this.valueFirstElement.removeClass('slider__value_hidden');
      this.valueSecondElement.removeClass('slider__value_hidden');
      this.valueFirstElement.addClass('slider__value_visible');
      this.valueSecondElement.addClass('slider__value_visible');
    }
  }
  changeOriental(value) {
    if (value) {
      this.scaleElement.addClass('slider__element_vertical');
      this.handleFirstElement.addClass('slider__handle_vertical');
      this.valueFirstElement.addClass('slider__value_vertical');
      this.handleSecondElement.addClass('slider__handle_vertical');
      this.valueSecondElement.addClass('slider__value_vertical');
    } else {
      this.scaleElement.removeClass('slider__element_vertical');
      this.handleFirstElement.removeClass('slider__handle_vertical');
      this.valueFirstElement.removeClass('slider__value_vertical');
      this.handleSecondElement.removeClass('slider__handle_vertical');
      this.valueSecondElement.removeClass('slider__value_vertical');
    }
  }
  rangeSelection(value) {
    if (value) {
      this.handleSecondElement.addClass('slider__handle_visible');
      this.handleSecondElement.removeClass('slider__handle_hidden');
    } else {
      this.handleSecondElement.removeClass('slider__handle_visible');
      this.handleSecondElement.addClass('slider__handle_hidden');
    }
  }
  valuesInTips(firstValue, secondValue) {
    this.valueFirstElement.text(firstValue);
    this.valueSecondElement.text(secondValue);
  }
  sendDataForViewConfig() {
    const kitValues = {
      slider: this.slider,
      showConfigPanel: this.showConfigPanel,
      minimum: this.minimum,
      maximum: this.maximum,

      value: this.value,
      valueRange: this.valueRange,
      step: this.step,

      handleValueHide: this.handleValueHide,
      verticalOrientation: this.verticalOrientation,
      rangeStatus: this.rangeStatus,
    };
    this.notify('updateViewConfig', kitValues);
  }
}

export default ViewSlider;

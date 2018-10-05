import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  updateViewSlider({ slider, showConfigPanel, minimum, maximum, maximumForHandleFirst, minimumForHandleSecond, value, valueRange, step, handleValueHide, verticalOrientation, rangeStatus }) {
    this.slider = slider;
    this.showConfigPanel = showConfigPanel;
    this.minimum = minimum;
    this.maximum = maximum;

    this.maximumForHandleFirst = maximumForHandleFirst;
    this.minimumForHandleSecond = minimumForHandleSecond;

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

    // this.handleFirstElement.mousedown((event) => {
    //   console.log('mousedown handleFIRST element');
    //   const currentElement = this.handleFirstElement;
    //   this.notify('mouseDown', { event, currentElement });
    // });

    // this.handleSecondElement.mousedown((event) => {
    //   console.log('mousedown   handleSECOND element');
    //   const currentElement = this.handleSecondElement;
    //   this.notify('mouseDown', { event, currentElement });
    // });
  }
  updateAfterClickOnSlider({ positionCursorClick, moveToPosition, newValue }) {
    const checkPositionForHandleElem = ((positionCursorClick - parseInt(this.handleFirstElement.css('left'))) > (parseInt(this.handleSecondElement.css('left')) - positionCursorClick));
    const checkPositionForHandleElemRange = ((positionCursorClick - parseInt(this.handleFirstElement.css('left'))) < (parseInt(this.handleSecondElement.css('left')) - positionCursorClick));
    if (this.rangeStatus) { // если интервал включен
      if (positionCursorClick < parseInt(this.handleFirstElement.css('left'))) { // если новая позиция < позиции первого элемента
        this.valueFirstElement.html(newValue);
        this.value = parseInt(newValue);
        this.handleFirstElement.animate({ left: `${moveToPosition}px` }, 300);
      } else if (positionCursorClick > parseInt(this.handleSecondElement.css('left'))) { // если новая позиция > позиции второго элемента
        this.valueSecondElement.html(newValue);
        this.valueRange = parseInt(newValue);
        this.handleSecondElement.animate({ left: `${moveToPosition}px` }, 300);
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

  // не сделано
  moveHandle(event, actualElement) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.scaleElement); // внутренние координаты слайдера
    const handleCoords = this.getCoords(actualElement); // внутренние координаты ползунка
    let positionCursorClick; // координаты левого края элемента
    if (this.verticalOrientation === true) {
      positionCursorClick = event.pageY - handleCoords.top;
    } else {
      positionCursorClick = event.pageX - handleCoords.left;
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
      if (actualElement === this.handleFirstElement) {
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
      const endEdge = this.scaleElement.outerWidth() - actualElement.outerWidth();
      if (beginEdge > endEdge) {
        beginEdge = endEdge;
      }
      actualElement.css('left', `${this.searchPosition(beginEdge, endEdge, position, positionRange, actualElement)}px`);

      if (actualElement === this.handleFirstElement) {
        this.calculateValue(this.maximum, this.minimum, beginEdge, false);
      } else if (actualElement === this.handleSecondElement) {
        this.calculateValue(this.maximum, this.minimum, beginEdge, true);
      }
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
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

      maximumForHandleFirst: this.maximumForHandleFirst,
      minimumForHandleSecond: this.minimumForHandleSecond,

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

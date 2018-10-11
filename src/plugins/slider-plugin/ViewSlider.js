import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  updateViewSlider(data) {
    data.$slider.html(`<div class='slider__element'>
                      <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
                      <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>
                    `);

    this.$scaleElement = data.$slider.find('.slider__element');
    this.$handleFirstElement = data.$slider.find('.slider__handle_left');
    this.$valueFirstElement = data.$slider.find('.slider__value_left');
    this.$handleSecondElement = data.$slider.find('.slider__handle_right');
    this.$valueSecondElement = data.$slider.find('.slider__value_right');

    data.handleValueHide ? this.showHandleValue(true) : this.showHandleValue(false);
    data.verticalOrientation ? this.changeOriental(true) : this.changeOriental(false);
    data.rangeStatus ? this.rangeSelection(true) : this.rangeSelection(false);

    this.defaultPosition(data.minimum, data.maximum, data.value, 'first', data.step);
    if (data.rangeStatus) {
      this.defaultPosition(data.minimum, data.maximum, data.valueRange, 'second', data.step);
    }
    this.setValuesInTips(data.value, data.valueRange);

    this.$scaleElement.click((event) => {
      const sliderWidth = this.$scaleElement.outerWidth() - this.$handleFirstElement.outerWidth();
      let positionCursorClick;
      const sliderCoords = this.getCoords(this.$scaleElement); // внутренние координаты слайдера
      if (data.verticalOrientation) {
        positionCursorClick = (event.pageY - sliderCoords.top - (this.$handleFirstElement.outerHeight() / 2));
      } else {
        positionCursorClick = (event.pageX - sliderCoords.left - (this.$handleFirstElement.outerWidth() / 2));
      }
      const positionFirstElement = parseInt(this.$handleFirstElement.css('left'));
      const positionSecondElement = parseInt(this.$handleSecondElement.css('left'));

      this.notify('clickTheSlider', {
        data,
        sliderWidth,
        positionCursorClick,
        positionFirstElement,
        positionSecondElement,
      });
    });
    this.$handleFirstElement.mousedown((event) => {
      this.moveHandle({ event, currentElement: this.$handleFirstElement, data });
    });
    this.$handleSecondElement.mousedown((event) => {
      this.moveHandle({ event, currentElement: this.$handleSecondElement, data });
    });
  }

  getCoords(element) { // получение координат курсора внутри элемента
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  moveHandle({ event, currentElement, data }) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.$scaleElement); // внутренние координаты слайдера
    const handleCoords = this.getCoords(currentElement); // внутренние координаты ползунка
    let positionCursorClick; // координаты клика внутри ползунка
    if (data.verticalOrientation === true) {
      positionCursorClick = event.pageY - handleCoords.top;
    } else {
      positionCursorClick = event.pageX - handleCoords.left;
    }
    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let beginEdge; // позиция курсора внутри слайдера
      const endEdge = this.$scaleElement.outerWidth() - currentElement.outerWidth();
      if (data.verticalOrientation) {
        beginEdge = (event.pageY - positionCursorClick - sliderCoords.top) / data.step;
      } else {
        beginEdge = (event.pageX - positionCursorClick - sliderCoords.left) / data.step;
      }

      let element;
      if (element === undefined) {
        if (currentElement === this.$handleFirstElement) {
          element = 'first';
        } else if (currentElement === this.$handleSecondElement) {
          element = 'second';
        }
      }
      this.notify('searchPositionWhenMoving', {
        beginEdge,
        endEdge,
        element,
        data,
      });
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  getPositionWhenMoving({ currentPositionHandle, element, valueTip }) {
    if (element === 'first') {
      this.$handleFirstElement.css('left', `${currentPositionHandle}px`);
      this.$valueFirstElement.html(valueTip);
    }
    if (element === 'second') {
      this.$handleSecondElement.css('left', `${currentPositionHandle}px`);
      this.$valueSecondElement.html(valueTip);
    }
  }
  defaultPosition(minimum, maximum, value, element, step) {
    const scaleWidth = this.$scaleElement.outerWidth() - this.$handleFirstElement.outerWidth();

    const dataForRequestDefaultPosition = { minimum, maximum, value, element, step, scaleWidth };
    this.notify('requestDefaultPosition', dataForRequestDefaultPosition);
  }
  getDefaultPosition({ defaultPosition, element, value }) {
    if (element === 'first') {
      this.$handleFirstElement.css('left', defaultPosition);
    }
    if (element === 'second') {
      this.$handleSecondElement.css('left', defaultPosition);
    }
  }
  showHandleValue(value) {
    if (value) {
      this.$valueFirstElement.removeClass('slider__value_visible');
      this.$valueSecondElement.removeClass('slider__value_visible');
      this.$valueFirstElement.addClass('slider__value_hidden');
      this.$valueSecondElement.addClass('slider__value_hidden');
    } else {
      this.$valueFirstElement.removeClass('slider__value_hidden');
      this.$valueSecondElement.removeClass('slider__value_hidden');
      this.$valueFirstElement.addClass('slider__value_visible');
      this.$valueSecondElement.addClass('slider__value_visible');
    }
  }
  changeOriental(value) {
    if (value) {
      this.$scaleElement.addClass('slider__element_vertical');
      this.$handleFirstElement.addClass('slider__handle_vertical');
      this.$valueFirstElement.addClass('slider__value_vertical');
      this.$handleSecondElement.addClass('slider__handle_vertical');
      this.$valueSecondElement.addClass('slider__value_vertical');
    } else {
      this.$scaleElement.removeClass('slider__element_vertical');
      this.$handleFirstElement.removeClass('slider__handle_vertical');
      this.$valueFirstElement.removeClass('slider__value_vertical');
      this.$handleSecondElement.removeClass('slider__handle_vertical');
      this.$valueSecondElement.removeClass('slider__value_vertical');
    }
  }
  rangeSelection(value) {
    if (value) {
      this.$handleSecondElement.addClass('slider__handle_visible');
      this.$handleSecondElement.removeClass('slider__handle_hidden');
    } else {
      this.$handleSecondElement.removeClass('slider__handle_visible');
      this.$handleSecondElement.addClass('slider__handle_hidden');
    }
  }
  setValuesInTips(firstValue, secondValue) {
    this.$valueFirstElement.text(firstValue);
    this.$valueSecondElement.text(secondValue);
  }
  sendData(data) {
    this.notify('changeData', data);
  }
}

export default ViewSlider;

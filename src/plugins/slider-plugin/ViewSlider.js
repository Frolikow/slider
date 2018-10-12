import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  updateViewSlider(data) {
    data.$slider.html(`<div class='slider__element'>
                      <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
                      <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>
                    `);

    this.$sliderScale = data.$slider.find('.slider__element');
    this.$firstHandle = data.$slider.find('.slider__handle_left');
    this.$firstTooltip = data.$slider.find('.slider__value_left');
    this.$secondHandle = data.$slider.find('.slider__handle_right');
    this.$secondTooltip = data.$slider.find('.slider__value_right');

    data.handleValueHide ? this.switchingVisibilityTooltips(true) : this.switchingVisibilityTooltips(false);
    data.verticalOrientation ? this.switchingOrientation(true) : this.switchingOrientation(false);
    data.rangeStatus ? this.switchingRangeSelection(true) : this.switchingRangeSelection(false);

    this.defaultPosition(data.minimum, data.maximum, data.value, 'first', data.step);
    if (data.rangeStatus) {
      this.defaultPosition(data.minimum, data.maximum, data.valueRange, 'second', data.step);
    }
    this.renderValueInTooltip(data.value, data.valueRange);

    const sliderWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();
    this.$sliderScale.click((event) => {
      let clickCoordinatesInsideTheHandle;
      const sliderCoords = this.getCoords(this.$sliderScale); // внутренние координаты слайдера
      if (data.verticalOrientation) {
        clickCoordinatesInsideTheHandle = (event.pageY - sliderCoords.top - (this.$firstHandle.outerHeight() / 2));
      } else {
        clickCoordinatesInsideTheHandle = (event.pageX - sliderCoords.left - (this.$firstHandle.outerWidth() / 2));
      }

      const positionFirstHandle = parseInt(this.$firstHandle.css('left'));
      const positionSecondHandle = parseInt(this.$secondHandle.css('left'));

      this.notify('clickTheSlider', {
        data,
        sliderWidth,
        clickCoordinatesInsideTheHandle,
        positionFirstHandle,
        positionSecondHandle,
      });
    });
    this.$firstHandle.mousedown((event) => {
      this.moveHandle({ event, currentItem: this.$firstHandle, data, sliderWidth });
    });
    this.$secondHandle.mousedown((event) => {
      this.moveHandle({ event, currentItem: this.$secondHandle, data, sliderWidth });
    });
  }

  getCoords(element) { // получение координат курсора внутри элемента
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  moveHandle({ event, currentItem, data, sliderWidth }) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.$sliderScale); // внутренние координаты слайдера
    const handleCoords = this.getCoords(currentItem); // внутренние координаты ползунка
    let clickCoordinatesInsideTheHandle; // координаты клика внутри ползунка
    if (data.verticalOrientation === true) {
      clickCoordinatesInsideTheHandle = event.pageY - handleCoords.top;
    } else {
      clickCoordinatesInsideTheHandle = event.pageX - handleCoords.left;
    }

    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let coordinatesInsideTheSlider; // позиция курсора внутри слайдера

      if (data.verticalOrientation) {
        coordinatesInsideTheSlider = (event.pageY - clickCoordinatesInsideTheHandle - sliderCoords.top) / data.step;
      } else {
        coordinatesInsideTheSlider = (event.pageX - clickCoordinatesInsideTheHandle - sliderCoords.left) / data.step;
      }

      let elementName;
      if (currentItem === this.$firstHandle) {
        elementName = 'first';
      } else if (currentItem === this.$secondHandle) {
        elementName = 'second';
      }
      this.notify('searchPositionWhenMoving', {
        coordinatesInsideTheSlider,
        sliderWidth,
        elementName,
        data,
      });
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  getPosition({ currentPositionHandle, elementName, valueTip }) {
    if (elementName === 'first') {
      this.$firstHandle.css('left', `${currentPositionHandle}px`);
      this.$firstTooltip.html(valueTip);
    }
    if (elementName === 'second') {
      this.$secondHandle.css('left', `${currentPositionHandle}px`);
      this.$secondTooltip.html(valueTip);
    }
  }
  defaultPosition(minimum, maximum, value, elementName, step) {
    const scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    const dataForRequestDefaultPosition = { minimum, maximum, value, elementName, step, scaleWidth };
    this.notify('requestDefaultPosition', dataForRequestDefaultPosition);
  }
  getDefaultPosition({ defaultPosition, elementName }) {
    if (elementName === 'first') {
      this.$firstHandle.css('left', defaultPosition);
    }
    if (elementName === 'second') {
      this.$secondHandle.css('left', defaultPosition);
    }
  }
  switchingVisibilityTooltips(value) {
    if (value) {
      this.$firstTooltip.removeClass('slider__value_visible');
      this.$secondTooltip.removeClass('slider__value_visible');
      this.$firstTooltip.addClass('slider__value_hidden');
      this.$secondTooltip.addClass('slider__value_hidden');
    } else {
      this.$firstTooltip.removeClass('slider__value_hidden');
      this.$secondTooltip.removeClass('slider__value_hidden');
      this.$firstTooltip.addClass('slider__value_visible');
      this.$secondTooltip.addClass('slider__value_visible');
    }
  }
  switchingOrientation(value) {
    if (value) {
      this.$sliderScale.addClass('slider__element_vertical');
      this.$firstHandle.addClass('slider__handle_vertical');
      this.$firstTooltip.addClass('slider__value_vertical');
      this.$secondHandle.addClass('slider__handle_vertical');
      this.$secondTooltip.addClass('slider__value_vertical');
    } else {
      this.$sliderScale.removeClass('slider__element_vertical');
      this.$firstHandle.removeClass('slider__handle_vertical');
      this.$firstTooltip.removeClass('slider__value_vertical');
      this.$secondHandle.removeClass('slider__handle_vertical');
      this.$secondTooltip.removeClass('slider__value_vertical');
    }
  }
  switchingRangeSelection(value) {
    if (value) {
      this.$secondHandle.addClass('slider__handle_visible');
      this.$secondHandle.removeClass('slider__handle_hidden');
    } else {
      this.$secondHandle.removeClass('slider__handle_visible');
      this.$secondHandle.addClass('slider__handle_hidden');
    }
  }
  renderValueInTooltip(firstValue, secondValue) {
    this.$firstTooltip.text(firstValue);
    this.$secondTooltip.text(secondValue);
  }
  sendData(data) {
    this.notify('changeData', data);
  }
}

export default ViewSlider;

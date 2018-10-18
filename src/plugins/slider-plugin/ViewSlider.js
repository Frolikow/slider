import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  constructor() {
    super();
    this.events = {
      controller: ['updateViewSlider', 'getCoords', 'moveHandle', 'setPosition', 'defaultPosition',
        'getDefaultPosition', 'enableVisibilityTooltips', 'orientationChange', 'enableRangeSelection', 'renderValueInTooltip', 'sendData'],
    };
  }
  updateViewSlider(dataViewSlider) {
    dataViewSlider.$slider.html(`<div class='slider__element'>
                      <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
                      <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>
                    `);

    this.$sliderScale = dataViewSlider.$slider.find('.slider__element');
    this.$firstHandle = dataViewSlider.$slider.find('.slider__handle_left');
    this.$firstTooltip = dataViewSlider.$slider.find('.slider__value_left');
    this.$secondHandle = dataViewSlider.$slider.find('.slider__handle_right');
    this.$secondTooltip = dataViewSlider.$slider.find('.slider__value_right');

    dataViewSlider.visibilityTooltips ? this.enableVisibilityTooltips(true) : this.enableVisibilityTooltips(false);
    dataViewSlider.verticalOrientation ? this.orientationChange(true) : this.orientationChange(false);
    dataViewSlider.rangeStatus ? this.enableRangeSelection(true) : this.enableRangeSelection(false);

    this.defaultPosition(dataViewSlider.minimum, dataViewSlider.maximum, dataViewSlider.value, 'first', dataViewSlider.step);
    if (dataViewSlider.rangeStatus) {
      this.defaultPosition(dataViewSlider.minimum, dataViewSlider.maximum, dataViewSlider.valueRange, 'second', dataViewSlider.step);
    }
    this.renderValueInTooltip(dataViewSlider.value, dataViewSlider.valueRange);

    const sliderWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();
    this.$sliderScale.click((event) => {
      let clickCoordinatesInsideTheHandle;
      const sliderCoords = this.getCoords(this.$sliderScale); // внутренние координаты слайдера
      if (dataViewSlider.verticalOrientation) {
        clickCoordinatesInsideTheHandle = (event.pageY - sliderCoords.top - (this.$firstHandle.outerHeight() / 2));
      } else {
        clickCoordinatesInsideTheHandle = (event.pageX - sliderCoords.left - (this.$firstHandle.outerWidth() / 2));
      }

      const positionFirstHandle = parseInt(this.$firstHandle.css('left'));
      const positionSecondHandle = parseInt(this.$secondHandle.css('left'));

      const dataForMoveHandleOnClick = dataViewSlider;

      dataForMoveHandleOnClick.sliderWidth = sliderWidth;
      dataForMoveHandleOnClick.clickCoordinatesInsideTheHandle = clickCoordinatesInsideTheHandle;
      dataForMoveHandleOnClick.positionFirstHandle = positionFirstHandle;
      dataForMoveHandleOnClick.positionSecondHandle = positionSecondHandle;

      dataForMoveHandleOnClick.type = 'viewSlider';
      this.notify('clickTheSlider', dataForMoveHandleOnClick);
    });

    this.$firstHandle.mousedown((event) => {
      this.moveHandle({ event, currentItem: this.$firstHandle, dataViewSlider, sliderWidth });
    });
    this.$secondHandle.mousedown((event) => {
      this.moveHandle({ event, currentItem: this.$secondHandle, dataViewSlider, sliderWidth });
    });
  }

  getCoords(element) { // получение координат курсора внутри элемента
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  moveHandle({ event, currentItem, dataViewSlider, sliderWidth }) { // событие нажатой ЛКМ
    const sliderCoords = this.getCoords(this.$sliderScale); // внутренние координаты слайдера
    const handleCoords = this.getCoords(currentItem); // внутренние координаты ползунка
    let clickCoordinatesInsideTheHandle; // координаты клика внутри ползунка
    if (dataViewSlider.verticalOrientation === true) {
      clickCoordinatesInsideTheHandle = event.pageY - handleCoords.top;
    } else {
      clickCoordinatesInsideTheHandle = event.pageX - handleCoords.left;
    }

    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let coordinatesInsideTheSlider; // позиция курсора внутри слайдера

      if (dataViewSlider.verticalOrientation) {
        coordinatesInsideTheSlider = (event.pageY - clickCoordinatesInsideTheHandle - sliderCoords.top) / dataViewSlider.step;
      } else {
        coordinatesInsideTheSlider = (event.pageX - clickCoordinatesInsideTheHandle - sliderCoords.left) / dataViewSlider.step;
      }

      let elementName;
      if (currentItem === this.$firstHandle) {
        elementName = 'first';
      } else if (currentItem === this.$secondHandle) {
        elementName = 'second';
      }
      const dataForSearchPosition = dataViewSlider;
      dataForSearchPosition.coordinatesInsideTheSlider = coordinatesInsideTheSlider;
      dataForSearchPosition.sliderWidth = sliderWidth;
      dataForSearchPosition.elementName = elementName;
      dataForSearchPosition.type = 'viewSlider';
      this.notify('searchPositionWhenMoving', dataForSearchPosition);
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  setPosition(dataWhenMoving) {
    if (dataWhenMoving.elementName === 'first') {
      const positionBeforeMoving = parseInt(this.$firstHandle.css('left'));
      const positionAfterMoving = (dataWhenMoving.currentPositionHandle ^ 0);
      if (positionBeforeMoving !== positionAfterMoving) {
        this.$firstHandle.css('left', `${dataWhenMoving.currentPositionHandle}px`);
        this.$firstTooltip.html(dataWhenMoving.valueTip);
      }
    }
    if (dataWhenMoving.elementName === 'second') {
      const positionBeforeMoving = parseInt(this.$secondHandle.css('left'));
      const positionAfterMoving = (dataWhenMoving.currentPositionHandle ^ 0);
      if (positionBeforeMoving !== positionAfterMoving) {
        this.$secondHandle.css('left', `${dataWhenMoving.currentPositionHandle}px`);
        this.$secondTooltip.html(dataWhenMoving.valueTip);
      }
    }
  }
  defaultPosition(minimum, maximum, valueCurrentHandle, elementName, step) {
    const scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    const dataForRequestDefaultPosition = { minimum, maximum, valueCurrentHandle, elementName, step, scaleWidth };
    dataForRequestDefaultPosition.type = 'viewSlider';
    this.notify('requestDefaultPosition', dataForRequestDefaultPosition);
  }
  getDefaultPosition(dataForReturnDefaultPosition) {
    if (dataForReturnDefaultPosition.elementName === 'first') {
      this.$firstHandle.css('left', dataForReturnDefaultPosition.defaultPosition);
    }
    if (dataForReturnDefaultPosition.elementName === 'second') {
      this.$secondHandle.css('left', dataForReturnDefaultPosition.defaultPosition);
    }
  }
  enableVisibilityTooltips(isEnabled) {
    if (isEnabled) {
      this.$firstTooltip.removeClass('slider__value_hidden');
      this.$secondTooltip.removeClass('slider__value_hidden');
      this.$firstTooltip.addClass('slider__value_visible');
      this.$secondTooltip.addClass('slider__value_visible');
    } else {
      this.$firstTooltip.removeClass('slider__value_visible');
      this.$secondTooltip.removeClass('slider__value_visible');
      this.$firstTooltip.addClass('slider__value_hidden');
      this.$secondTooltip.addClass('slider__value_hidden');
    }
  }
  orientationChange(isEnabled) {
    if (isEnabled) {
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
  enableRangeSelection(isEnabled) {
    if (isEnabled) {
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
  sendData(dataToSend) {
    dataToSend.type = 'viewSlider';
    this.notify('updatePluginOptions', dataToSend);
  }
}

export default ViewSlider;

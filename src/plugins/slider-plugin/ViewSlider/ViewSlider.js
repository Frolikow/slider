import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor(viewOptions) {
    super();
    super.addEmitter(this.constructor.name);

    this.slider = viewOptions.slider;
    this.visibilityTooltips = viewOptions.visibilityTooltips;
    this.verticalOrientation = viewOptions.verticalOrientation;
    this.rangeStatus = viewOptions.rangeStatus;
  }
  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.slider.find('.slider__element');
    this.$firstHandle = this.slider.find('.slider__handle_left');
    this.$firstTooltip = this.slider.find('.slider__value_left');
    this.$secondHandle = this.slider.find('.slider__handle_right');
    this.$secondTooltip = this.slider.find('.slider__value_right');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();
    this.notify('calculateIndexOfRelativeCoordinates', this.scaleWidth);
    this._eventHandlers();
  }
  updateViewSlider(dataViewSlider) {
    // dataViewSlider = { value,valueRange,rangeStatus,firstPosition,secondPosition };
    if (dataViewSlider.rangeStatus === undefined) {
      dataViewSlider.rangeStatus = this.rangeStatus;
    }

    if (dataViewSlider.visibilityTooltips === undefined) {
      dataViewSlider.visibilityTooltips = this.visibilityTooltips;
    }

    if (dataViewSlider.verticalOrientation === undefined) {
      dataViewSlider.verticalOrientation = this.verticalOrientation;
    }
    this.visibilityTooltips = dataViewSlider.visibilityTooltips;
    this.verticalOrientation = dataViewSlider.verticalOrientation;
    this.rangeStatus = dataViewSlider.rangeStatus;

    this.visibilityTooltips ? this._enableVisibilityTooltips(true) : this._enableVisibilityTooltips(false);
    this.verticalOrientation ? this._orientationChange(true) : this._orientationChange(false);
    this.rangeStatus ? this._enableRangeSelection(true) : this._enableRangeSelection(false);

    const dataForSetHandlePositionAndHandleValue = {
      value: dataViewSlider.value,
      valueRange: dataViewSlider.valueRange,
      coordinatesFirstHandle: dataViewSlider.firstPosition,
      coordinatesSecondHandle: dataViewSlider.secondPosition,
      elementType: 'first',
    };
    this._setHandlePositionAndHandleValue(dataForSetHandlePositionAndHandleValue);
    if (this.rangeStatus) {
      dataForSetHandlePositionAndHandleValue.elementType = 'second';
      this._setHandlePositionAndHandleValue(dataForSetHandlePositionAndHandleValue);
    }
  }
  _eventHandlers() {
    this.$sliderScale.click((event) => {
      let theCoordinatesOfTheClick;
      const sliderCoordinates = this._getTheCoordinatesOfTheElementInsideTheWindow(this.$sliderScale); // внутренние координаты слайдера

      if (this.verticalOrientation) {
        theCoordinatesOfTheClick = parseInt(event.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2));
      } else {
        theCoordinatesOfTheClick = parseInt(event.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));
      }
      this.notify('sendCoordinatesWhenClick', theCoordinatesOfTheClick);
    });

    this.$firstHandle.mousedown((event) => {
      this._moveTheHandleWhenDragging({ event, $currentItem: this.$firstHandle });
    });

    this.$secondHandle.mousedown((event) => {
      this._moveTheHandleWhenDragging({ event, $currentItem: this.$secondHandle });
    });
  }

  _moveTheHandleWhenDragging({ event, $currentItem }) { // событие нажатой ЛКМ
    const sliderCoordinates = this._getTheCoordinatesOfTheElementInsideTheWindow(this.$sliderScale); // координаты слайдера относительно окна
    const handleCoordinates = this._getTheCoordinatesOfTheElementInsideTheWindow($currentItem); // координаты ползунка относительно окна

    let cursorPositionInsideTheHandle; // координаты клика внутри ползунка
    if (this.verticalOrientation === true) {
      cursorPositionInsideTheHandle = event.pageY - handleCoordinates.top;
    } else {
      cursorPositionInsideTheHandle = event.pageX - handleCoordinates.left;
    }

    $(document).on('mousemove', (event) => {
      let theCoordinatesOfTheClickInTheSlider; // позиция курсора внутри слайдера
      if (this.verticalOrientation) {
        theCoordinatesOfTheClickInTheSlider = event.pageY - cursorPositionInsideTheHandle - sliderCoordinates.top;
      } else {
        theCoordinatesOfTheClickInTheSlider = event.pageX - cursorPositionInsideTheHandle - sliderCoordinates.left;
      }
      let elementType;
      if ($currentItem === this.$firstHandle) {
        elementType = 'first';
      } else if ($currentItem === this.$secondHandle) {
        elementType = 'second';
      }
      const dataForPositionSearch = { coordinates: theCoordinatesOfTheClickInTheSlider, elementType, rangeStatus: this.rangeStatus };
      this.notify('sendCoordinatesWhenMoving', dataForPositionSearch);
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  _setHandlePositionAndHandleValue(dataForSetHandlePositionAndHandleValue) {
    // dataForSetHandlePositionAndHandleValue = { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType }
    const { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType } = dataForSetHandlePositionAndHandleValue;
    if (elementType === 'first') {
      this.$firstHandle.css('left', `${coordinatesFirstHandle}px`);
      this.$firstTooltip.html(value);
    }
    if (elementType === 'second') {
      this.$secondHandle.css('left', `${coordinatesSecondHandle}px`);
      this.$secondTooltip.html(valueRange);
    }
  }
  _getTheCoordinatesOfTheElementInsideTheWindow(element) { // получение координат курсора внутри элемента
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }
  _enableVisibilityTooltips(isEnabled) {
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
  _orientationChange(isEnabled) {
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
  _enableRangeSelection(isEnabled) {
    if (isEnabled) {
      this.$secondHandle.addClass('slider__handle_visible');
      this.$secondHandle.removeClass('slider__handle_hidden');
    } else {
      this.$secondHandle.removeClass('slider__handle_visible');
      this.$secondHandle.addClass('slider__handle_hidden');
    }
  }
  _createSliderElement() {
    if (this.slider.find('.slider__element')) {
      this.slider.find('.slider__element').remove();
    }
    const bookListingTemplate = require('./sliderTemplate.hbs');
    const sliderElement = document.createElement('div');
    sliderElement.className = 'slider__element';

    sliderElement.innerHTML = bookListingTemplate({
      handles: [{
        className: 'slider__handle slider__handle_left',
        tooltip: [{
          className: 'slider__value slider__value_left',
        }],
      }, {
        className: 'slider__handle slider__handle_right',
        tooltip: [{
          className: 'slider__value slider__value_right',
        }],
      }],
    });
    this.slider.append(sliderElement);
  }
}

export default ViewSlider;

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
    this._createSlider();
    this.$sliderScale = this.slider.find('.slider__element');
    this.$firstHandle = this.slider.find('.slider__handle_left');
    this.$firstTooltip = this.slider.find('.slider__value_left');
    this.$secondHandle = this.slider.find('.slider__handle_right');
    this.$secondTooltip = this.slider.find('.slider__value_right');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();
    this.notify('calculateIndexOfRelativeCoordinates', this.scaleWidth);
    this._listeners();
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

    const dataForSetPositionHandle = {
      value: dataViewSlider.value,
      valueRange: dataViewSlider.valueRange,
      coordinatesFirstHandle: dataViewSlider.firstPosition,
      coordinatesSecondHandle: dataViewSlider.secondPosition,
      elementType: 'first',
    };
    this._setPositionHandle(dataForSetPositionHandle);
    if (this.rangeStatus) {
      dataForSetPositionHandle.elementType = 'second';
      this._setPositionHandle(dataForSetPositionHandle);
    }
  }
  _moveHandle({ event, $currentItem }) { // событие нажатой ЛКМ
    const sliderCoords = this._getCoords(this.$sliderScale); // внутренние координаты слайдера
    const handleCoords = this._getCoords($currentItem); // внутренние координаты ползунка
    let clickCoordinatesInsideTheHandle; // координаты клика внутри ползунка
    if (this.verticalOrientation === true) {
      clickCoordinatesInsideTheHandle = event.pageY - handleCoords.top;
    } else {
      clickCoordinatesInsideTheHandle = event.pageX - handleCoords.left;
    }
    // движение нажатой ЛКМ
    $(document).on('mousemove', (event) => {
      let coordinatesInsideTheSlider; // позиция курсора внутри слайдера
      if (this.verticalOrientation) {
        coordinatesInsideTheSlider = event.pageY - clickCoordinatesInsideTheHandle - sliderCoords.top;
      } else {
        coordinatesInsideTheSlider = event.pageX - clickCoordinatesInsideTheHandle - sliderCoords.left;
      }
      let elementType;
      if ($currentItem === this.$firstHandle) {
        elementType = 'first';
      } else if ($currentItem === this.$secondHandle) {
        elementType = 'second';
      }
      const dataForSearchPosition = { coordinates: coordinatesInsideTheSlider, elementType, rangeStatus: this.rangeStatus };
      this.notify('sendCoordinatesWhenMoving', dataForSearchPosition);
    });

    $(document).mouseup(() => { // событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }
  _listeners() {
    this.$sliderScale.click((event) => {
      let coordsClick;
      const sliderCoords = this._getCoords(this.$sliderScale); // внутренние координаты слайдера
      if (this.verticalOrientation) {
        coordsClick = parseInt(event.pageY - sliderCoords.top - (this.$firstHandle.outerHeight() / 2));
      } else {
        coordsClick = parseInt(event.pageX - sliderCoords.left - (this.$firstHandle.outerWidth() / 2));
      }
      this.notify('sendCoordinatesWhenClick', coordsClick);
    });

    this.$firstHandle.mousedown((event) => {
      this._moveHandle({ event, $currentItem: this.$firstHandle });
    });

    this.$secondHandle.mousedown((event) => {
      this._moveHandle({ event, $currentItem: this.$secondHandle });
    });
  }
  _setPositionHandle(dataForSetPositionHandle) {
    // dataForSetPositionHandle = { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType }
    const { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType } = dataForSetPositionHandle;
    if (elementType === 'first') {
      this.$firstHandle.css('left', `${coordinatesFirstHandle}px`);
      this.$firstTooltip.html(value);
    }
    if (elementType === 'second') {
      this.$secondHandle.css('left', `${coordinatesSecondHandle}px`);
      this.$secondTooltip.html(valueRange);
    }
  }

  // приватные методы которые можно не трогать
  _getCoords(element) { // получение координат курсора внутри элемента
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
  _createSlider() {
    if (this.slider.find('.slider__element')) {
      this.slider.find('.slider__element').remove();
    }
    const bookListingTemplate = require('./sliderTemplate.handlebars');
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

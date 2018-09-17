class Controller {
  constructor(model, view, viewConfig, thisForController) {
    this.eventsInits(model, view, viewConfig, thisForController);
  }

  eventsInits(model, view, viewConfig, thisForController) {
    // init slider elem
    model.$sliderElem = thisForController.find('.slider__element');
    model.$handleElem = thisForController.find('.slider__handle_left');
    model.$valueElem = thisForController.find('.slider__value_left');
    model.$generalValueElem = thisForController.find('.slider__value');
    // init slider range elem
    model.$handleElemRange = thisForController.find('.slider__handle_right');
    model.$valueElemRange = thisForController.find('.slider__value_right');
    // init slider configPanel elem
    model.$configShowHandleValueElem = thisForController.next().find('.configuration__show-handle-value');
    model.$configOrientationElem = thisForController.next().find('.configuration__orientation');
    model.$configRangeElem = thisForController.next().find('.configuration__range');
    model.$configCurrentValueElem = thisForController.next().find('.configuration__current-value_left');
    model.$configCurrentValueRangeElem = thisForController.next().find('.configuration__current-value_right');
    model.$configMinValueElem = thisForController.next().find('.configuration__minimum-value');
    model.$configMaxValueElem = thisForController.next().find('.configuration__maximum-value');
    model.$configSizeOfStepElem = thisForController.next().find('.configuration__size-of-step');

    model.$configCurrentValueElem.attr({ min: model.minimum, max: model.maximum, value: model.value });
    model.$configMinValueElem.attr({ max: (model.maximum - model.step), value: model.minimum });
    model.$configMaxValueElem.attr({ min: (model.minimum + model.step), value: model.maximum });
    model.$configSizeOfStepElem.attr({ min: 1, max: (model.maximum - model.minimum), value: model.step });
    model.$configCurrentValueRangeElem.attr({ min: (model.value + model.step), max: model.maximum, value: model.valueRange });

    model.$handleElemRange.css('display', 'none');
    model.$configCurrentValueRangeElem.css('display', 'none');

    model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));

    if (model.handleValueHide) {
      model.$configShowHandleValueElem.click();
      model.$valueElem.css('display', 'none');
      model.$valueElemRange.css('display', 'none');
    }
    model.$configShowHandleValueElem.change(function () { // убрать флажок
      if (this.checked) {
        model.$valueElem.css('display', 'none');
        model.$valueElemRange.css('display', 'none');
      } else {
        model.$valueElem.css('display', 'block');
        model.$valueElemRange.css('display', 'block');
      }
    });

    if (model.verticalOrientation) {
      model.$configOrientationElem.click();
      thisForController.addClass('slider_vertical');
      model.$sliderElem.addClass('slider__element_vertical');
      model.$handleElem.addClass('slider__handle_vertical');
      model.$generalValueElem.addClass('slider__value_vertical');
      model.$handleElemRange.addClass('slider__handle_vertical');
      model.$valueElemRange.addClass('slider__value_vertical');
      model.verticalOrientation = true;
    }
    model.$configOrientationElem.change(function () { // вкл/выкл вертикальной ориентации
      if (this.checked) {
        thisForController.addClass('slider_vertical');
        model.$sliderElem.addClass('slider__element_vertical');
        model.$handleElem.addClass('slider__handle_vertical');
        model.$generalValueElem.addClass('slider__value_vertical');
        model.$handleElemRange.addClass('slider__handle_vertical');
        model.$valueElemRange.addClass('slider__value_vertical');
        model.verticalOrientation = true;
      } else {
        thisForController.removeClass('slider_vertical');
        model.$sliderElem.removeClass('slider__element_vertical');
        model.$handleElem.removeClass('slider__handle_vertical');
        model.$generalValueElem.removeClass('slider__value_vertical');
        model.$handleElemRange.removeClass('slider__handle_vertical');
        model.$valueElemRange.removeClass('slider__value_vertical');
        model.verticalOrientation = false;
      }
    });

    if (model.rangeStatus) {
      model.$configRangeElem.click();
      model.createHandleRange();
    }

    model.$configRangeElem.change(() => { // вкл/выкл выбор диапазона
      if (model.rangeStatus) {
        model.rangeStatus = false;
      } else {
        model.rangeStatus = true;
      }
      model.createHandleRange();
    });

    model.$configCurrentValueElem.focusout(function () { // текущее значение слайдера
      model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, parseInt(this.value), model.$valueElem));
      this.value = model.value;
      model.$configCurrentValueRangeElem.attr('min', (model.value + model.step));
    });

    model.$configCurrentValueRangeElem.focusout(function () {
      model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, parseInt(this.value), model.$valueElemRange));
      this.value = parseInt(model.valueRange);
      model.$valueElemRange.text(this.value);
      model.$configCurrentValueElem.attr('max', (this.value - model.step));
    });


    model.$configMinValueElem.focusout(function () { // минимальное значение слайдера
      model.minimum = parseInt(this.value);
      model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      if (model.rangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      }
      model.$configCurrentValueElem.attr('min', model.minimum);
      model.$configSizeOfStepElem.attr('max', (model.maximum - model.minimum));
    });

    model.$configMaxValueElem.focusout(function () { // максимальное значение слайдера
      model.maximum = parseInt(this.value);
      model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      if (model.rangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      }
      model.$configCurrentValueElem.attr('max', model.maximum);
      model.$configSizeOfStepElem.attr('max', (model.maximum - model.minimum));
      model.$configCurrentValueRangeElem.attr('max', model.maximum);
    });

    model.$configSizeOfStepElem.focusout(function () { // размера шага слайдера
      model.step = parseInt(this.value);
      model.$configCurrentValueElem.attr('max', model.maximum);
      model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      if (model.rangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      }
    });

    model.$sliderElem.click((event) => {
      model.clickOnSlider(event);
    });

    model.$handleElem.mousedown((event) => {
      const $currentElement = model.$handleElem;
      model.mouseDown(event, $currentElement);
    });

    model.$handleElemRange.mousedown((event) => {
      const $currentElement = model.$handleElemRange;
      model.mouseDown(event, $currentElement);
    });
  }
}

export default Controller;

class Controller {
  constructor(model, view, viewConfig, thisForController) {
    this.sliderEventsInits(model, view, viewConfig, thisForController);
  }

  sliderEventsInits(model, view, viewConfig, thisForController) {
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

    model.$configCurrentValueElem.attr({ min: model.sliderMin, max: model.sliderMax, value: model.sliderValue });
    model.$configMinValueElem.attr({ max: (model.sliderMax - model.sliderStep), value: model.sliderMin });
    model.$configMaxValueElem.attr({ min: (model.sliderMin + model.sliderStep), value: model.sliderMax });
    model.$configSizeOfStepElem.attr({ min: 1, max: (model.sliderMax - model.sliderMin), value: model.sliderStep });
    model.$configCurrentValueRangeElem.attr({ min: (model.sliderValue + model.sliderStep), max: model.sliderMax, value: model.sliderValueRange });

    model.$handleElemRange.css('display', 'none');
    model.$configCurrentValueRangeElem.css('display', 'none');

    model.$handleElem.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.$valueElem));

    if (model.sliderHandleValueHide) {
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

    if (model.sliderRangeStatus) {
      model.$configRangeElem.click();
      model.createHandleRange();
    }

    model.$configRangeElem.change(() => { // вкл/выкл выбор диапазона
      if (model.sliderRangeStatus) {
        model.sliderRangeStatus = false;
      } else {
        model.sliderRangeStatus = true;
      }
      model.createHandleRange();
    });

    model.$configCurrentValueElem.focusout(function () { // текущее значение слайдера
      model.$handleElem.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, parseInt(this.value), model.$valueElem));
      this.value = model.sliderValue;
      model.$configCurrentValueRangeElem.attr('min', (model.sliderValue + model.sliderStep));
    });

    model.$configMinValueElem.focusout(function () { // минимальное значение слайдера
      model.sliderMin = parseInt(this.value);
      model.$handleElem.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.$valueElem));
      if (model.sliderRangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValueRange, model.$valueElemRange));
      }
      model.$configCurrentValueElem.attr('min', model.sliderMin);
      model.$configSizeOfStepElem.attr('max', (model.sliderMax - model.sliderMin));
    });

    model.$configMaxValueElem.focusout(function () { // максимальное значение слайдера
      model.sliderMax = parseInt(this.value);
      model.$handleElem.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.$valueElem));
      if (model.sliderRangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValueRange, model.$valueElemRange));
      }
      model.$configCurrentValueElem.attr('max', model.sliderMax);
      model.$configSizeOfStepElem.attr('max', (model.sliderMax - model.sliderMin));
      model.$configCurrentValueRangeElem.attr('max', model.sliderMax);
    });

    model.$configSizeOfStepElem.focusout(function () { // размера шага слайдера
      model.sliderStep = parseInt(this.value);
      model.$configCurrentValueElem.attr('max', model.sliderMax);
      model.$handleElem.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.$valueElem));
      if (model.sliderRangeStatus) {
        model.$handleElemRange.css('left', model.calculateDefaultValue(model.sliderMax, model.sliderMin, model.sliderValueRange, model.$valueElemRange));
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

import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewConfiguration extends EventEmitter {
  constructor(options) {
    super();

    this.initState(options);
    // this.unSubscribe();
  }

  someMethod() {
    console.log('call someMethod(ViewConfiguration) complete');
  }
  someMethod4() {
    console.log('call someMethod4(ViewConfiguration) complete');
  }


  initState(options) {
    this.slider = $(options.slider);
    this.showConfigPanel = options.showConfigPanel || false;
    this.minimumConfigPanel = options.minimum || 1;
    this.maximumConfigPanel = options.maximum || 10;
    this.valueConfigPanel = options.value || this.minimumConfigPanel;
    this.valueRangeConfigPanel = options.valueRange || this.maximumConfigPanel;
    this.stepConfigPanel = options.step || 1;
    this.verticalOrientationConfigPanel = options.verticalOrientation || false;
    this.rangeStatusConfigPanel = options.rangeStatus || false;
    this.handleValueHideConfigPanel = options.handleValueHide || false;

    if (this.showConfigPanel) {
      this.slider.append(`<div class='slider__configuration'>
              <div class='configuration'>
              
              <label> <input type='checkbox' class='configuration__show-handle-value'>Убрать флажок</label>
              <label> <input type='checkbox' class='configuration__orientation'>Включить вертикальное отображение</label>
              <label> <input type='checkbox'  class='configuration__range'>Включить выбор интервала</label>
              
              <label>Текущее значение</label> 
                <div class='configuration__current-value'>
                  <input type='number' class='configuration__current-value_first'> 
                  <input type='number' class='configuration__current-value_second'> </div>
              <label>Минимальное значение слайдера</label> 
                <input type='number' class='configuration__minimum-value'>
              <label>Максимальное значение слайдера</label> 
                <input type='number' class='configuration__maximum-value'>
              <label>Размер шага слайдера</label> 
                <input type='number' class='configuration__size-of-step'>`);

      const showHandle = this.slider.find('.configuration__show-handle-value');
      const oriental = this.slider.find('.configuration__orientation');
      const range = this.slider.find('.configuration__range');
      const value = this.slider.find('.configuration__current-value_first');
      const valueRange = this.slider.find('.configuration__current-value_second');
      const valueMinimum = this.slider.find('.configuration__minimum-value');
      const valueMaximum = this.slider.find('.configuration__maximum-value');
      const valueStep = this.slider.find('.configuration__size-of-step');

      value.attr({ min: this.minimumConfigPanel, max: this.maximumConfigPanel, value: this.valueConfigPanel });
      valueRange.attr({ min: (this.valueConfigPanel + this.stepConfigPanel), max: this.maximumConfigPanel, value: this.valueRangeConfigPanel });
      valueMinimum.attr({ max: (this.maximumConfigPanel - this.stepConfigPanel), value: this.minimumConfigPanel });
      valueMaximum.attr({ min: (this.minimumConfigPanel + this.stepConfigPanel), value: this.maximumConfigPanel });
      valueStep.attr({ min: 1, max: (this.maximumConfigPanel - this.minimumConfigPanel), value: this.stepConfigPanel });
      showHandle.attr({ checked: this.handleValueHideConfigPanel ? 'checked' : null });
      oriental.attr({ checked: this.verticalOrientationConfigPanel ? 'checked' : null });
      range.attr({ checked: this.rangeStatusConfigPanel ? 'checked' : null });

      showHandle.on('change', () => this.notify('someMethod'));
      oriental.on('change', () => console.log('oriental - changed'));
      range.on('change', () => console.log('range - changed'));
      value.on('focusout', () => console.log('value - focusOut'));
      valueRange.on('focusout', () => console.log('valueRange - focusOut'));
      valueMinimum.on('focusout', () => console.log('valueMinimum - focusOut'));
      valueMaximum.on('focusout', () => console.log('valueMaximum - focusOut'));
      valueStep.on('focusout', () => console.log('valueStep - focusOut'));


      // model.$configCurrentValueElem.focusout(function () { // текущее значение слайдера
      //   model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, parseInt(this.value), model.$valueElem));
      //   this.value = model.value;
      //   model.$configCurrentValueRangeElem.attr('min', (model.value + model.step));
      // });

      // model.$configCurrentValueRangeElem.focusout(function () {
      //   model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, parseInt(this.value), model.$valueElemRange));
      //   this.value = parseInt(model.valueRange);
      //   model.$valueElemRange.text(this.value);
      //   model.$configCurrentValueElem.attr('max', (this.value - model.step));
      // });


      // model.$configMinValueElem.focusout(function () { // минимальное значение слайдера
      //   model.minimum = parseInt(this.value);
      //   model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      //   if (model.rangeStatus) {
      //     model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      //   }
      //   model.$configCurrentValueElem.attr('min', model.minimum);
      //   model.$configSizeOfStepElem.attr('max', (model.maximum - model.minimum));
      // });

      // model.$configMaxValueElem.focusout(function () { // максимальное значение слайдера
      //   model.maximum = parseInt(this.value);
      //   model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      //   if (model.rangeStatus) {
      //     model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      //   }
      //   model.$configCurrentValueElem.attr('max', model.maximum);
      //   model.$configSizeOfStepElem.attr('max', (model.maximum - model.minimum));
      //   model.$configCurrentValueRangeElem.attr('max', model.maximum);
      // });

      // model.$configSizeOfStepElem.focusout(function () { // размера шага слайдера
      //   model.step = parseInt(this.value);
      //   model.$configCurrentValueElem.attr('max', model.maximum);
      //   model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));
      //   if (model.rangeStatus) {
      //     model.$handleElemRange.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.valueRange, model.$valueElemRange));
      //   }
      // });


      //  это нужно перенести во вьюху слайдера_____________________________________________________00000
      // model.$handleElemRange.addClass('slider__handle_hidden');
      // model.$configCurrentValueRangeElem.addClass('configuration__current-value-range_hidden');

      // model.$handleElem.css('left', model.calculateDefaultValue(model.maximum, model.minimum, model.value, model.$valueElem));

      if (this.rangeStatusConfigPanel) {
        //  это нужно перенести во вьюху слайдера_____________________________________________________00000
        // model.$valueElem.addClass('slider__value_hidden');
        // model.$valueElemRange.addClass('slider__value_hidden');
        // model.createHandleRange();
      }
      range.change(function () { // вкл/выкл выбор интервала
        //  это нужно перенести во вьюху слайдера_____________________________________________________00000
        if (this.checked) {
          console.log('вкл интервал');
          //   model.rangeStatus = false;
        } else {
          console.log('выкл интервал');
          //   model.rangeStatus = true;
        }
        // model.createHandleRange();
      });


      if (this.handleValueHideConfigPanel) {
        //  это нужно перенести во вьюху слайдера_____________________________________________________00000
        // model.$valueElem.removeClass('slider__value_visible');
        // model.$valueElemRange.removeClass('slider__value_visible');
        // model.$valueElem.addClass('slider__value_hidden');
        // model.$valueElemRange.addClass('slider__value_hidden');
      }
      showHandle.change(function () { // убрать флажок
        if (this.checked) {
          console.log('скрыть флажки');
          //  это нужно перенести во вьюху слайдера_____________________________________________________00000
          // model.$valueElem.removeClass('slider__value_visible');
          // model.$valueElemRange.removeClass('slider__value_visible');
          // model.$valueElem.addClass('slider__value_hidden');
          // model.$valueElemRange.addClass('slider__value_hidden');
        } else {
          console.log('показать флажки');
          //  это нужно перенести во вьюху слайдера_____________________________________________________00000
          // model.$valueElem.removeClass('slider__value_hidden');
          // model.$valueElemRange.removeClass('slider__value_hidden');
          // model.$valueElem.addClass('slider__value_visible');
          // model.$valueElemRange.addClass('slider__value_visible');
        }
      });

      if (this.verticalOrientationConfigPanel) {
        // thisForController.addClass('slider_vertical');
        // model.$sliderElem.addClass('slider__element_vertical');
        // model.$handleElem.addClass('slider__handle_vertical');
        // model.$generalValueElem.addClass('slider__value_vertical');
        // model.$handleElemRange.addClass('slider__handle_vertical');
        // model.$valueElemRange.addClass('slider__value_vertical');
      }
      oriental.change(function () { // вкл/выкл вертикальной ориентации
        if (this.checked) {
          console.log('вкл  вертикальной ориентации');
          // this.verticalOrientationConfigPanel = true;
          //  это нужно перенести во вьюху слайдера_____________________________________________________00000
          // thisForController.addClass('slider_vertical');
          // model.$sliderElem.addClass('slider__element_vertical');
          // model.$handleElem.addClass('slider__handle_vertical');
          // model.$generalValueElem.addClass('slider__value_vertical');
          // model.$handleElViewSlideremRange.addClass('slider__handle_vertical');
          // model.$valueElemRange.addClass('slider__value_vertical');
        } else {
          console.log('выкл  вертикальной ориентации');
          // this.verticalOrientationConfigPanel = false;
          //  это нужно перенести во вьюху слайдера_____________________________________________________00000
          // thisForController.removeClass('slider_vertical');
          // model.$sliderElem.removeClass('slider__element_vertical');
          // model.$handleElem.removeClass('slider__handle_vertical');
          // model.$generalValueElem.removeClass('slider__value_vertical');
          // model.$handleElemRange.removeClass('slider__handle_vertical');
          // model.$valueElemRange.removeClass('slider__value_vertical');
        }
      });
    }
  }
}

export default ViewConfiguration;

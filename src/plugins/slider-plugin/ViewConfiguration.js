import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewConfiguration extends EventEmitter {
  updateViewPanel(data) {
    if (data.showConfigPanel) {
      data.$slider.find('.slider__configuration').remove();
      this.createPanel(data.$slider);

      const $showHandleValue = data.$slider.find('.configuration__show-handle-value');
      const $oriental = data.$slider.find('.configuration__orientation');
      const $range = data.$slider.find('.configuration__range');

      const $value = data.$slider.find('.configuration__current-value_first');
      const $valueRange = data.$slider.find('.configuration__current-value_second');
      const $valueMinimum = data.$slider.find('.configuration__minimum-value');
      const $valueMaximum = data.$slider.find('.configuration__maximum-value');
      const $valueStep = data.$slider.find('.configuration__size-of-step');

      if (!data.rangeStatus) {
        $valueRange.removeClass('configuration__current-value_visible');
        $valueRange.addClass('configuration__current-value_hidden');
      }

      const kitElements = { $showHandleValue, $oriental, $range, $value, $valueRange, $valueMinimum, $valueMaximum, $valueStep };
      this.initAttributes(kitElements, data);

      $showHandleValue.on('change', () => {
        data.handleValueHide = $showHandleValue.prop('checked');
        this.sendData(data);
      });
      $oriental.on('change', () => {
        data.verticalOrientation = $oriental.prop('checked');
        this.sendData(data);
      });
      $range.on('change', () => {
        data.rangeStatus = $range.prop('checked');
        if (data.rangeStatus) {
          $valueRange.removeClass('configuration__current-value_hidden');
          $valueRange.addClass('configuration__current-value_visible');
        } else {
          $valueRange.removeClass('configuration__current-value_visible');
          $valueRange.addClass('configuration__current-value_hidden');
        }
        this.sendData(data);
      });

      $value.on('focusout', () => {
        data.value = +$value.val();
        this.sendData(data);
      });
      $valueRange.on('focusout', () => {
        data.valueRange = +$valueRange.val();
        this.sendData(data);
      });
      $valueMinimum.on('focusout', () => {
        data.minimum = +$valueMinimum.val();
        data.value = data.value < data.minimum ? data.minimum : data.value;
        data.valueRange = data.valueRange <= data.minimum ? data.maximum : data.valueRange;
        this.sendData(data);
      });
      $valueMaximum.on('focusout', () => {
        data.maximum = +$valueMaximum.val();
        data.valueRange = data.valueRange > data.maximum ? data.maximum : data.valueRange;
        data.value = data.value >= data.maximum ? data.minimum : data.value;
        this.sendData(data);
      });
      $valueStep.on('focusout', () => {
        data.step = +$valueStep.val();
        this.sendData(data);
      });
    }
  }

  initAttributes(kitElements, data) {
    kitElements.$showHandleValue.attr({
      checked: data.handleValueHide ? 'checked' : null,
    });
    kitElements.$oriental.attr({
      checked: data.verticalOrientation ? 'checked' : null,
    });
    kitElements.$range.attr({
      checked: data.rangeStatus ? 'checked' : null,
    });
    kitElements.$value.attr({
      min: data.minimum,
      max: data.rangeStatus ? data.valueRange - data.step : data.maximum,
      value: data.value,
    });
    kitElements.$valueRange.attr({
      min: data.value + data.step,
      max: data.maximum,
      value: data.valueRange,
    });
    kitElements.$valueMinimum.attr({
      max: data.maximum - data.step,
      value: data.minimum,
    });
    kitElements.$valueMaximum.attr({
      min: data.minimum + data.step,
      value: data.maximum,
    });
    kitElements.$valueStep.attr({
      min: 1,
      max: data.maximum - data.minimum,
      value: data.step,
    });
  }

  createPanel(sliderBlock) {
    sliderBlock.append(`<div class='slider__configuration'>
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
  }

  sendData(data) {
    this.notify('changeData', data);
  }
}

export default ViewConfiguration;

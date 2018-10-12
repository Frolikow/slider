import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewPanel extends EventEmitter {
  updateViewPanel(data) {
    if (data.showConfigPanel) {
      data.$slider.find('.slider__configuration').remove();
      this.createPanel(data.$slider);

      const $switchVisibilityTooltips = data.$slider.find('.configuration__show-handle-value');
      const $orientationSwitch = data.$slider.find('.configuration__orientation');
      const $rangeSwitch = data.$slider.find('.configuration__range');

      const $currentValueFirstHandle = data.$slider.find('.configuration__current-value_first');
      const $currentValueSecondHandle = data.$slider.find('.configuration__current-value_second');
      const $minimumValue = data.$slider.find('.configuration__minimum-value');
      const $maximumValue = data.$slider.find('.configuration__maximum-value');
      const $stepSizeValue = data.$slider.find('.configuration__size-of-step');

      if (!data.rangeStatus) {
        $currentValueSecondHandle.removeClass('configuration__current-value_visible');
        $currentValueSecondHandle.addClass('configuration__current-value_hidden');
      }

      const kitElements = { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle, $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue };
      this.initAttributes(kitElements, data);

      $switchVisibilityTooltips.on('change', () => {
        data.handleValueHide = $switchVisibilityTooltips.prop('checked');
        this.sendData(data);
      });
      $orientationSwitch.on('change', () => {
        data.verticalOrientation = $orientationSwitch.prop('checked');
        this.sendData(data);
      });
      $rangeSwitch.on('change', () => {
        data.rangeStatus = $rangeSwitch.prop('checked');
        if (data.rangeStatus) {
          $currentValueSecondHandle.removeClass('configuration__current-value_hidden');
          $currentValueSecondHandle.addClass('configuration__current-value_visible');
        } else {
          $currentValueSecondHandle.removeClass('configuration__current-value_visible');
          $currentValueSecondHandle.addClass('configuration__current-value_hidden');
        }
        this.sendData(data);
      });

      $currentValueFirstHandle.on('focusout', () => {
        data.value = +$currentValueFirstHandle.val();
        this.sendData(data);
      });
      $currentValueSecondHandle.on('focusout', () => {
        data.valueRange = +$currentValueSecondHandle.val();
        this.sendData(data);
      });
      $minimumValue.on('focusout', () => {
        data.minimum = +$minimumValue.val();
        data.value = data.value < data.minimum ? data.minimum : data.value;
        data.valueRange = data.valueRange <= data.minimum ? data.maximum : data.valueRange;
        this.sendData(data);
      });
      $maximumValue.on('focusout', () => {
        data.maximum = +$maximumValue.val();
        data.valueRange = data.valueRange > data.maximum ? data.maximum : data.valueRange;
        data.value = data.value >= data.maximum ? data.minimum : data.value;
        this.sendData(data);
      });
      $stepSizeValue.on('focusout', () => {
        data.step = +$stepSizeValue.val();
        this.sendData(data);
      });
    }
  }

  initAttributes(kitElements, data) {
    kitElements.$switchVisibilityTooltips.attr({
      checked: data.handleValueHide ? 'checked' : null,
    });
    kitElements.$orientationSwitch.attr({
      checked: data.verticalOrientation ? 'checked' : null,
    });
    kitElements.$rangeSwitch.attr({
      checked: data.rangeStatus ? 'checked' : null,
    });
    kitElements.$currentValueFirstHandle.attr({
      min: data.minimum,
      max: data.rangeStatus ? data.valueRange - data.step : data.maximum,
      value: data.value,
    });
    kitElements.$currentValueSecondHandle.attr({
      min: data.value + data.step,
      max: data.maximum,
      value: data.valueRange,
    });
    kitElements.$minimumValue.attr({
      max: data.maximum - data.step,
      value: data.minimum,
    });
    kitElements.$maximumValue.attr({
      min: data.minimum + data.step,
      value: data.maximum,
    });
    kitElements.$stepSizeValue.attr({
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

export default ViewPanel;

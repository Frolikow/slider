import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewConfiguration extends EventEmitter {
  updateViewConfig({ slider, showConfigPanel, minimum, maximum, value, valueRange, step, handleValueHide, verticalOrientation, rangeStatus }) {
    this.slider = slider;
    this.showConfigPanel = showConfigPanel;
    this.minimum = minimum;
    this.maximum = maximum;

    this.value = value;
    this.valueRange = valueRange;
    this.step = step;

    this.verticalOrientation = verticalOrientation;
    this.rangeStatus = rangeStatus;
    this.handleValueHide = handleValueHide;

    this.render();
  }

  render() {
    if (this.showConfigPanel) {
      this.slider.find('.slider__configuration').remove();
      this.createPanel();

      const showHandleValue = this.slider.find('.configuration__show-handle-value');
      const oriental = this.slider.find('.configuration__orientation');
      const range = this.slider.find('.configuration__range');

      const value = this.slider.find('.configuration__current-value_first');
      const valueRange = this.slider.find('.configuration__current-value_second');
      const valueMinimum = this.slider.find('.configuration__minimum-value');
      const valueMaximum = this.slider.find('.configuration__maximum-value');
      const valueStep = this.slider.find('.configuration__size-of-step');

      if (!this.rangeStatus) {
        valueRange.removeClass('configuration__current-value_visible');
        valueRange.addClass('configuration__current-value_hidden');
      }

      const kitElements = { showHandleValue, oriental, range, value, valueRange, valueMinimum, valueMaximum, valueStep };
      this.initAttributes(kitElements);


      showHandleValue.on('change', () => {
        this.handleValueHide = showHandleValue.prop('checked');
        this.updateView();
      });
      oriental.on('change', () => {
        this.verticalOrientation = oriental.prop('checked');
        this.updateView();
      });
      range.on('change', () => {
        this.rangeStatus = range.prop('checked');
        if (this.rangeStatus) {
          valueRange.removeClass('configuration__current-value_hidden');
          valueRange.addClass('configuration__current-value_visible');
        } else {
          valueRange.removeClass('configuration__current-value_visible');
          valueRange.addClass('configuration__current-value_hidden');
        }
        this.updateView();
      });

      value.on('focusout', () => {
        this.value = +value.val();
        this.updateView();
      });
      valueRange.on('focusout', () => {
        this.valueRange = +valueRange.val();
        this.updateView();
      });
      valueMinimum.on('focusout', () => {
        this.minimum = +valueMinimum.val();
        this.updateView();
      });
      valueMaximum.on('focusout', () => {
        this.maximum = +valueMaximum.val();
        this.updateView();
      });
      valueStep.on('focusout', () => {
        this.step = +valueStep.val();
        this.updateView();
      });
    }
  }

  createPanel() {
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
  }

  updateView() {
    const kitValues = {
      slider: this.slider,
      showConfigPanel: this.showConfigPanel,
      minimum: this.minimum,
      maximum: this.maximum,

      value: this.value,
      valueRange: this.valueRange,
      step: this.step,

      handleValueHide: this.handleValueHide,
      verticalOrientation: this.verticalOrientation,
      rangeStatus: this.rangeStatus,
    };
    this.notify('reinitState', kitValues);
  }

  initAttributes({ showHandleValue, oriental, range, value, valueRange, valueMinimum, valueMaximum, valueStep }) {
    showHandleValue.attr({
      checked: this.handleValueHide ? 'checked' : null,
    });
    oriental.attr({
      checked: this.verticalOrientation ? 'checked' : null,
    });
    range.attr({
      checked: this.rangeStatus ? 'checked' : null,
    });
    value.attr({
      min: this.minimum,
      max: this.rangeStatus ? this.valueRange - this.step : this.maximum,
      value: this.value,
    });
    valueRange.attr({
      min: this.value + this.step,
      max: this.maximum,
      value: this.valueRange,
    });
    valueMinimum.attr({
      max: this.maximum - this.step,
      value: this.minimum,
    });
    valueMaximum.attr({
      min: this.minimum + this.step,
      value: this.maximum,
    });
    valueStep.attr({
      min: 1,
      max: this.maximum - this.minimum,
      value: this.step,
    });
  }
}

export default ViewConfiguration;

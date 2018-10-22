import $ from 'jquery';
import EventEmitter from './eventEmiter';

// const source = require('./template.handlebars');

class ViewPanel extends EventEmitter {
  constructor(viewOptions) {
    super();
    super.addEmitter(this.constructor.name);

    this.slider = viewOptions.slider;
    this.visibilityConfigPanel = viewOptions.visibilityConfigPanel;
    this.visibilityTooltips = viewOptions.visibilityTooltips;
    this.verticalOrientation = viewOptions.verticalOrientation;
    this.rangeStatus = viewOptions.rangeStatus;
  }

  updateViewPanel(dataViewPanel) {
    if (this.visibilityConfigPanel) {
      this.slider.find('.slider__configuration').remove();
      this.createPanel(this.slider);


      const $switchVisibilityTooltips = this.slider.find('.configuration__show-handle-value');
      const $orientationSwitch = this.slider.find('.configuration__orientation');
      const $rangeSwitch = this.slider.find('.configuration__range');
      const $currentValueFirstHandle = this.slider.find('.configuration__current-value_first');
      const $currentValueSecondHandle = this.slider.find('.configuration__current-value_second');
      const $minimumValue = this.slider.find('.configuration__minimum-value');
      const $maximumValue = this.slider.find('.configuration__maximum-value');
      const $stepSizeValue = this.slider.find('.configuration__size-of-step');

      if (!this.rangeStatus) {
        $currentValueSecondHandle.removeClass('configuration__current-value_visible');
        $currentValueSecondHandle.addClass('configuration__current-value_hidden');
      }

      const kitElements = {
        $switchVisibilityTooltips,
        $orientationSwitch,
        $rangeSwitch,
        $currentValueFirstHandle,
        $currentValueSecondHandle,
        $minimumValue,
        $maximumValue,
        $stepSizeValue,
      };
      this.eventListeners(kitElements, dataViewPanel);
      this.initAttributes(kitElements, dataViewPanel);
    }
  }
  eventListeners(kitElements, dataViewPanel) {
    const { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle,
      $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue } = kitElements;
    $switchVisibilityTooltips.on('change', () => {
      this.visibilityTooltips = $switchVisibilityTooltips.prop('checked');
      this.sendData(dataViewPanel);
    });
    $orientationSwitch.on('change', () => {
      this.verticalOrientation = $orientationSwitch.prop('checked');
      this.sendData(dataViewPanel);
    });
    $rangeSwitch.on('change', () => {
      this.rangeStatus = $rangeSwitch.prop('checked');
      if (this.rangeStatus) {
        $currentValueSecondHandle.removeClass('configuration__current-value_hidden');
        $currentValueSecondHandle.addClass('configuration__current-value_visible');
      } else {
        $currentValueSecondHandle.removeClass('configuration__current-value_visible');
        $currentValueSecondHandle.addClass('configuration__current-value_hidden');
      }
      this.sendData(dataViewPanel);
    });

    $currentValueFirstHandle.on('focusout', () => {
      dataViewPanel.value = +$currentValueFirstHandle.val();
      this.sendData(dataViewPanel);
    });
    $currentValueSecondHandle.on('focusout', () => {
      dataViewPanel.valueRange = +$currentValueSecondHandle.val();
      this.sendData(dataViewPanel);
    });
    $minimumValue.on('focusout', () => {
      dataViewPanel.minimum = +$minimumValue.val();
      dataViewPanel.value = dataViewPanel.value < dataViewPanel.minimum ? dataViewPanel.minimum : dataViewPanel.value;
      dataViewPanel.valueRange = dataViewPanel.valueRange <= dataViewPanel.minimum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      this.sendData(dataViewPanel);
    });
    $maximumValue.on('focusout', () => {
      dataViewPanel.maximum = +$maximumValue.val();
      dataViewPanel.valueRange = dataViewPanel.valueRange > dataViewPanel.maximum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      dataViewPanel.value = dataViewPanel.value >= dataViewPanel.maximum ? dataViewPanel.minimum : dataViewPanel.value;
      this.sendData(dataViewPanel);
    });
    $stepSizeValue.on('focusout', () => {
      dataViewPanel.step = +$stepSizeValue.val();
      this.sendData(dataViewPanel);
    });
  }

  initAttributes(kitElements, dataForInitAttributes) {
    kitElements.$switchVisibilityTooltips.attr({
      checked: this.visibilityTooltips ? 'checked' : null,
    });
    kitElements.$orientationSwitch.attr({
      checked: this.verticalOrientation ? 'checked' : null,
    });
    kitElements.$rangeSwitch.attr({
      checked: this.rangeStatus ? 'checked' : null,
    });
    kitElements.$currentValueFirstHandle.attr({
      step: dataForInitAttributes.step,
      min: dataForInitAttributes.minimum,
      max: this.rangeStatus ? dataForInitAttributes.valueRange - dataForInitAttributes.step : dataForInitAttributes.maximum,
      value: dataForInitAttributes.value,
    });
    kitElements.$currentValueSecondHandle.attr({
      step: dataForInitAttributes.step,
      min: dataForInitAttributes.value + dataForInitAttributes.step,
      max: dataForInitAttributes.maximum,
      value: dataForInitAttributes.valueRange,
    });
    kitElements.$minimumValue.attr({
      step: dataForInitAttributes.step,
      max: dataForInitAttributes.maximum - dataForInitAttributes.step,
      value: dataForInitAttributes.minimum,
    });
    kitElements.$maximumValue.attr({
      step: dataForInitAttributes.step,
      min: dataForInitAttributes.minimum + dataForInitAttributes.step,
      value: dataForInitAttributes.maximum,
    });
    kitElements.$stepSizeValue.attr({
      min: 1,
      max: dataForInitAttributes.maximum - dataForInitAttributes.minimum,
      value: dataForInitAttributes.step,
    });
  }

  createPanel(sliderBlock) {
    sliderBlock.append(`<div class='slider__configuration'>
    <div class='configuration'>
    
    <label> <input type='checkbox' class='configuration__show-handle-value'>Включить  флажки</label>
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


    // /////////////////////////////////////////////

    // $(document).find('.test').remove();
    // this.bookListingTemplate = require('./template.handlebars');
    // const div = document.createElement('div');
    // div.className = 'test';
    // div.innerHTML = this.bookListingTemplate({
    //   title: 'test',
    //   body: 'Your books are due next Tuesday',
    //   // books: [
    //   //   { title: 'A book', synopsis: 'With a description' },
    //   //   { title: 'Another book', synopsis: 'From a very good author' },
    //   //   { title: 'Book without synopsis' },
    //   // ],
    // });
    // document.body.appendChild(div);

    // /////////////////////////////////////////////
  }

  sendData(dataForUpdatePlugin) {
    dataForUpdatePlugin.rangeStatus = this.rangeStatus;
    dataForUpdatePlugin.visibilityTooltips = this.visibilityTooltips;
    dataForUpdatePlugin.verticalOrientation = this.verticalOrientation;
    this.notify('updatePluginOptions', dataForUpdatePlugin);
  }
}

export default ViewPanel;

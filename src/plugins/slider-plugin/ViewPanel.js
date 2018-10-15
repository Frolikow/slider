import $ from 'jquery';
import EventEmitter from './eventEmiter';

// const source = require('./template.handlebars');

class ViewPanel extends EventEmitter {
  updateViewPanel(dataViewPanel) {
    if (dataViewPanel.visibilityConfigPanel) {
      dataViewPanel.$slider.find('.slider__configuration').remove();
      this.createPanel(dataViewPanel.$slider);
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
      const $switchVisibilityTooltips = dataViewPanel.$slider.find('.configuration__show-handle-value');
      const $orientationSwitch = dataViewPanel.$slider.find('.configuration__orientation');
      const $rangeSwitch = dataViewPanel.$slider.find('.configuration__range');

      const $currentValueFirstHandle = dataViewPanel.$slider.find('.configuration__current-value_first');
      const $currentValueSecondHandle = dataViewPanel.$slider.find('.configuration__current-value_second');
      const $minimumValue = dataViewPanel.$slider.find('.configuration__minimum-value');
      const $maximumValue = dataViewPanel.$slider.find('.configuration__maximum-value');
      const $stepSizeValue = dataViewPanel.$slider.find('.configuration__size-of-step');

      if (!dataViewPanel.rangeStatus) {
        $currentValueSecondHandle.removeClass('configuration__current-value_visible');
        $currentValueSecondHandle.addClass('configuration__current-value_hidden');
      }

      const kitElements = { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle, $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue };
      this.initAttributes(kitElements, dataViewPanel);

      $switchVisibilityTooltips.on('change', () => {
        dataViewPanel.visibilityTooltips = $switchVisibilityTooltips.prop('checked');
        this.sendData(dataViewPanel);
      });
      $orientationSwitch.on('change', () => {
        dataViewPanel.verticalOrientation = $orientationSwitch.prop('checked');
        this.sendData(dataViewPanel);
      });
      $rangeSwitch.on('change', () => {
        dataViewPanel.rangeStatus = $rangeSwitch.prop('checked');
        if (dataViewPanel.rangeStatus) {
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
  }

  initAttributes(kitElements, dataForInitAttributes) {
    kitElements.$switchVisibilityTooltips.attr({
      checked: dataForInitAttributes.visibilityTooltips ? 'checked' : null,
    });
    kitElements.$orientationSwitch.attr({
      checked: dataForInitAttributes.verticalOrientation ? 'checked' : null,
    });
    kitElements.$rangeSwitch.attr({
      checked: dataForInitAttributes.rangeStatus ? 'checked' : null,
    });
    kitElements.$currentValueFirstHandle.attr({
      min: dataForInitAttributes.minimum,
      max: dataForInitAttributes.rangeStatus ? dataForInitAttributes.valueRange - dataForInitAttributes.step : dataForInitAttributes.maximum,
      value: dataForInitAttributes.value,
    });
    kitElements.$currentValueSecondHandle.attr({
      min: dataForInitAttributes.value + dataForInitAttributes.step,
      max: dataForInitAttributes.maximum,
      value: dataForInitAttributes.valueRange,
    });
    kitElements.$minimumValue.attr({
      max: dataForInitAttributes.maximum - dataForInitAttributes.step,
      value: dataForInitAttributes.minimum,
    });
    kitElements.$maximumValue.attr({
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
  }

  sendData(dataForUpdatePlugin) {
    this.notify('updatePluginOptions', dataForUpdatePlugin);
  }
}

export default ViewPanel;

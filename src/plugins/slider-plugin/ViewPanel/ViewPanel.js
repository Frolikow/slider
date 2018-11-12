import EventEmitter from '../eventEmiter/eventEmiter';

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
      this._createPanel(this.slider);

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
      this._eventListeners(kitElements, dataViewPanel);
      this._initAttributes(kitElements, dataViewPanel);
    }
  }
  _eventListeners(kitElements, dataViewPanel) {
    const { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle,
      $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue } = kitElements;
    $switchVisibilityTooltips.on('change', () => {
      this.visibilityTooltips = $switchVisibilityTooltips.prop('checked');
      this._sendData(dataViewPanel);
    });
    $orientationSwitch.on('change', () => {
      this.verticalOrientation = $orientationSwitch.prop('checked');
      this._sendData(dataViewPanel);
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
      this._sendData(dataViewPanel);
    });

    $currentValueFirstHandle.on('focusout', () => {
      dataViewPanel.value = +$currentValueFirstHandle.val();
      this._sendData(dataViewPanel);
    });
    $currentValueSecondHandle.on('focusout', () => {
      dataViewPanel.valueRange = +$currentValueSecondHandle.val();
      this._sendData(dataViewPanel);
    });
    $minimumValue.on('focusout', () => {
      dataViewPanel.minimum = +$minimumValue.val();
      dataViewPanel.value = dataViewPanel.value < dataViewPanel.minimum ? dataViewPanel.minimum : dataViewPanel.value;
      dataViewPanel.valueRange = dataViewPanel.valueRange <= dataViewPanel.minimum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      this._sendData(dataViewPanel);
    });
    $maximumValue.on('focusout', () => {
      dataViewPanel.maximum = +$maximumValue.val();
      dataViewPanel.valueRange = dataViewPanel.valueRange > dataViewPanel.maximum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      dataViewPanel.value = dataViewPanel.value >= dataViewPanel.maximum ? dataViewPanel.minimum : dataViewPanel.value;
      this._sendData(dataViewPanel);
    });
    $stepSizeValue.on('focusout', () => {
      dataViewPanel.step = +$stepSizeValue.val();
      this._sendData(dataViewPanel);
    });
  }
  _initAttributes(kitElements, dataForInitAttributes) {
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
  _sendData(dataForUpdatePlugin) {
    dataForUpdatePlugin.rangeStatus = this.rangeStatus;
    dataForUpdatePlugin.visibilityTooltips = this.visibilityTooltips;
    dataForUpdatePlugin.verticalOrientation = this.verticalOrientation;
    this.notify('updateState', dataForUpdatePlugin);
  }
  _createPanel(sliderBlock) {
    this.bookListingTemplate = require('./panelTemplate.handlebars');
    const configurationPanel = document.createElement('div');
    configurationPanel.className = 'slider__configuration';

    configurationPanel.innerHTML = this.bookListingTemplate({
      elements: [{
        blockClassName: 'configuration',
        checkboxElements: [{
          title: 'Включить флажки',
          inputType: 'checkbox',
          className: 'configuration__show-handle-value',
        }, {
          title: 'Включить вертикальное отображение',
          inputType: 'checkbox',
          className: 'configuration__orientation',
        }, {
          title: 'Включить выбор интервала',
          inputType: 'checkbox',
          className: 'configuration__range',
        }],
        inputElements: [
          {
            title: 'Текущее значение',
            className: 'configuration__current-value',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__current-value_first',
            }, {
              inputType: 'number',
              className: 'configuration__current-value_second',
            }],
          }, {
            title: 'Минимальное значение слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__minimum-value',
            }],
          }, {
            title: 'Максимальное значение слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__maximum-value',
            }],
          }, {
            title: 'Размер шага слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__size-of-step',
            }],
          },
        ],
      }],
    });
    sliderBlock.append(configurationPanel);
  }
}

export default ViewPanel;

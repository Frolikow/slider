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
      this._createPanelElement(this.slider);

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
      this._eventHandlers(kitElements, dataViewPanel);
      this._initializeElementsAttributes(kitElements, dataViewPanel);
    }
  }
  _eventHandlers(kitElements, dataViewPanel) {
    const { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle,
      $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue } = kitElements;
    $switchVisibilityTooltips.on('change', () => {
      this.visibilityTooltips = $switchVisibilityTooltips.prop('checked');
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
    $orientationSwitch.on('change', () => {
      this.verticalOrientation = $orientationSwitch.prop('checked');
      this._sendDataToUpdateThePlugin(dataViewPanel);
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
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });

    $currentValueFirstHandle.on('focusout', () => {
      dataViewPanel.value = parseInt($currentValueFirstHandle.val());
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
    $currentValueSecondHandle.on('focusout', () => {
      dataViewPanel.valueRange = parseInt($currentValueSecondHandle.val());
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
    $minimumValue.on('focusout', () => {
      dataViewPanel.minimum = parseInt($minimumValue.val());
      dataViewPanel.value = dataViewPanel.value < dataViewPanel.minimum ? dataViewPanel.minimum : dataViewPanel.value;
      dataViewPanel.valueRange = dataViewPanel.valueRange <= dataViewPanel.minimum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
    $maximumValue.on('focusout', () => {
      dataViewPanel.maximum = parseInt($maximumValue.val());
      dataViewPanel.valueRange = dataViewPanel.valueRange > dataViewPanel.maximum ? dataViewPanel.maximum : dataViewPanel.valueRange;
      dataViewPanel.value = dataViewPanel.value >= dataViewPanel.maximum ? dataViewPanel.minimum : dataViewPanel.value;
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
    $stepSizeValue.on('focusout', () => {
      dataViewPanel.step = parseInt($stepSizeValue.val());
      this._sendDataToUpdateThePlugin(dataViewPanel);
    });
  }

  _initializeElementsAttributes(kitElements, dataForAttributeInitialization) {
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
      step: dataForAttributeInitialization.step,
      min: dataForAttributeInitialization.minimum,
      max: this.rangeStatus ? dataForAttributeInitialization.valueRange - dataForAttributeInitialization.step : dataForAttributeInitialization.maximum,
      value: dataForAttributeInitialization.value,
    });
    kitElements.$currentValueSecondHandle.attr({
      step: dataForAttributeInitialization.step,
      min: dataForAttributeInitialization.value + dataForAttributeInitialization.step,
      max: dataForAttributeInitialization.maximum,
      value: dataForAttributeInitialization.valueRange,
    });
    kitElements.$minimumValue.attr({
      step: dataForAttributeInitialization.step,
      max: dataForAttributeInitialization.maximum - dataForAttributeInitialization.step,
      value: dataForAttributeInitialization.minimum,
    });
    kitElements.$maximumValue.attr({
      step: dataForAttributeInitialization.step,
      min: dataForAttributeInitialization.minimum + dataForAttributeInitialization.step,
      value: dataForAttributeInitialization.maximum,
    });
    kitElements.$stepSizeValue.attr({
      min: 1,
      max: dataForAttributeInitialization.maximum - dataForAttributeInitialization.minimum,
      value: dataForAttributeInitialization.step,
    });
  }

  _sendDataToUpdateThePlugin(dataForUpdatePlugin) {
    dataForUpdatePlugin.rangeStatus = this.rangeStatus;
    dataForUpdatePlugin.visibilityTooltips = this.visibilityTooltips;
    dataForUpdatePlugin.verticalOrientation = this.verticalOrientation;
    this.notify('updateState', dataForUpdatePlugin);
  }
  _createPanelElement(sliderBlock) {
    this.bookListingTemplate = require('./panelTemplate.hbs');
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

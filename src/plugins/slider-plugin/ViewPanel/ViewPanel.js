import EventEmitter from '../eventEmiter/eventEmiter';

class ViewPanel extends EventEmitter {
  constructor(viewOptions) {
    super();
    super.addEmitter(this.constructor.name);

    this.slider = viewOptions.slider;
    this.visibilityConfigPanel = viewOptions.visibilityConfigPanel;
  }
  updateViewPanel(dataViewPanel) {
    if (this.visibilityConfigPanel) {
      this.visibilityTooltips = dataViewPanel.visibilityTooltips;
      this.verticalOrientation = dataViewPanel.verticalOrientation;
      this.rangeStatus = dataViewPanel.rangeStatus;

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

  _sendDataToUpdatePlugin(dataForUpdatePlugin) {
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
  _eventHandlers(kitElements, dataViewPanel) {
    const { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle,
      $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue } = kitElements;

    $switchVisibilityTooltips.change(this._handleSwitchVisibilityTooltipsOnChange.bind(this, dataViewPanel, $switchVisibilityTooltips));
    $orientationSwitch.change(this._handleOrientationSwitchOnChange.bind(this, dataViewPanel, $orientationSwitch));
    $rangeSwitch.change(this._handleRangeSwitchOnChange.bind(this, dataViewPanel, $rangeSwitch, $currentValueSecondHandle));

    $currentValueFirstHandle.focusout(this._handleCurrentValueFirstHandleFocusOut.bind(this, dataViewPanel, $currentValueFirstHandle));
    $currentValueSecondHandle.focusout(this._handleCurrentValueSecondHandleFocusOut.bind(this, dataViewPanel, $currentValueSecondHandle));
    $minimumValue.focusout(this._handleMinimumValueFocusOut.bind(this, dataViewPanel, $minimumValue));
    $maximumValue.focusout(this._handleMaximumValueFocusOut.bind(this, dataViewPanel, $maximumValue));
    $stepSizeValue.focusout(this._handleStepSizeValueFocusOut.bind(this, dataViewPanel, $stepSizeValue));
  }
  _handleSwitchVisibilityTooltipsOnChange(dataViewPanel, $switchVisibilityTooltips) {
    this.visibilityTooltips = $switchVisibilityTooltips.prop('checked');
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleOrientationSwitchOnChange(dataViewPanel, $orientationSwitch) {
    this.verticalOrientation = $orientationSwitch.prop('checked');
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleRangeSwitchOnChange(dataViewPanel, $rangeSwitch, $currentValueSecondHandle) {
    this.rangeStatus = $rangeSwitch.prop('checked');
    if (this.rangeStatus) {
      $currentValueSecondHandle.removeClass('configuration__current-value_hidden');
      $currentValueSecondHandle.addClass('configuration__current-value_visible');
    } else {
      $currentValueSecondHandle.removeClass('configuration__current-value_visible');
      $currentValueSecondHandle.addClass('configuration__current-value_hidden');
    }
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleCurrentValueFirstHandleFocusOut(dataViewPanel, $currentValueFirstHandle) {
    dataViewPanel.value = parseInt($currentValueFirstHandle.val());
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleCurrentValueSecondHandleFocusOut(dataViewPanel, $currentValueSecondHandle) {
    dataViewPanel.valueRange = parseInt($currentValueSecondHandle.val());
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleMinimumValueFocusOut(dataViewPanel, $minimumValue) {
    dataViewPanel.minimum = parseInt($minimumValue.val());
    dataViewPanel.value = dataViewPanel.value < dataViewPanel.minimum ? dataViewPanel.minimum : dataViewPanel.value;
    dataViewPanel.valueRange = dataViewPanel.valueRange <= dataViewPanel.minimum ? dataViewPanel.maximum : dataViewPanel.valueRange;
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleMaximumValueFocusOut(dataViewPanel, $maximumValue) {
    dataViewPanel.maximum = parseInt($maximumValue.val());
    dataViewPanel.valueRange = dataViewPanel.valueRange > dataViewPanel.maximum ? dataViewPanel.maximum : dataViewPanel.valueRange;
    dataViewPanel.value = dataViewPanel.value >= dataViewPanel.maximum ? dataViewPanel.minimum : dataViewPanel.value;
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
  _handleStepSizeValueFocusOut(dataViewPanel, $stepSizeValue) {
    dataViewPanel.step = parseInt($stepSizeValue.val());
    this._sendDataToUpdatePlugin(dataViewPanel);
  }
}

export default ViewPanel;

import EventEmitter from '../eventEmiter/eventEmiter';

class ViewPanel extends EventEmitter {
  constructor(viewOptions) {
    super();
    super.addEmitter(this.constructor.name);

    this.panelData = viewOptions;
  }
  initPanel() {
    if (this.panelData.isVisibilityConfigPanel) {
      this._createPanelElement(this.panelData.$slider);

      const $switchVisibilityTooltips = this.panelData.$slider.find('.configuration__show-handle-value');
      const $orientationSwitch = this.panelData.$slider.find('.configuration__orientation');
      const $rangeSwitch = this.panelData.$slider.find('.configuration__range');
      const $currentValueFirstHandle = this.panelData.$slider.find('.configuration__current-value_first');
      const $currentValueSecondHandle = this.panelData.$slider.find('.configuration__current-value_second');
      const $minimumValue = this.panelData.$slider.find('.configuration__minimum-value');
      const $maximumValue = this.panelData.$slider.find('.configuration__maximum-value');
      const $stepSizeValue = this.panelData.$slider.find('.configuration__size-of-step');

      this.kitElements = {
        $switchVisibilityTooltips,
        $orientationSwitch,
        $rangeSwitch,
        $currentValueFirstHandle,
        $currentValueSecondHandle,
        $minimumValue,
        $maximumValue,
        $stepSizeValue,
      };
      this._createEventHandlers();
    }
  }
  updatePanel(panelData) {
    if (this.panelData.isVisibilityConfigPanel) {
      this.panelData = panelData;

      this.panelData.isVisibilityTooltips = panelData.isVisibilityTooltips;
      this.panelData.isVerticalOrientation = panelData.isVerticalOrientation;
      this.panelData.isIntervalSelection = panelData.isIntervalSelection;

      if (!this.panelData.isIntervalSelection) {
        this.kitElements.$currentValueSecondHandle.removeClass('configuration__current-value_visible');
        this.kitElements.$currentValueSecondHandle.addClass('configuration__current-value_hidden');
      }
      this._initializeElementsAttributes(this.kitElements);
    }
  }

  _initializeElementsAttributes(kitElements) {
    kitElements.$switchVisibilityTooltips.attr({
      checked: this.panelData.isVisibilityTooltips ? 'checked' : null,
    });
    kitElements.$orientationSwitch.attr({
      checked: this.panelData.isVerticalOrientation ? 'checked' : null,
    });
    kitElements.$rangeSwitch.attr({
      checked: this.panelData.isIntervalSelection ? 'checked' : null,
    });
    kitElements.$currentValueFirstHandle.attr({
      step: this.panelData.step,
      min: this.panelData.minimum,
      max: this.panelData.isIntervalSelection ? this.panelData.valueRange - this.panelData.step : this.panelData.maximum,
      value: this.panelData.value,
    });
    kitElements.$currentValueSecondHandle.attr({
      step: this.panelData.step,
      min: this.panelData.value + this.panelData.step,
      max: this.panelData.maximum,
      value: this.panelData.valueRange,
    });
    kitElements.$minimumValue.attr({
      step: this.panelData.step,
      max: this.panelData.maximum - this.panelData.step,
      value: this.panelData.minimum,
    });
    kitElements.$maximumValue.attr({
      step: this.panelData.step,
      min: this.panelData.minimum + this.panelData.step,
      value: this.panelData.maximum,
    });
    kitElements.$stepSizeValue.attr({
      min: 1,
      max: this.panelData.maximum - this.panelData.minimum,
      value: this.panelData.step,
    });
  }

  _sendDataToUpdatePlugin() {
    this.notify('updateState', this.panelData);
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
  _createEventHandlers() {
    const { $switchVisibilityTooltips, $orientationSwitch, $rangeSwitch, $currentValueFirstHandle,
      $currentValueSecondHandle, $minimumValue, $maximumValue, $stepSizeValue } = this.kitElements;

    $switchVisibilityTooltips.change(this._handleSwitchVisibilityTooltipsOnChange.bind(this, $switchVisibilityTooltips));
    $orientationSwitch.change(this._handleOrientationSwitchOnChange.bind(this, $orientationSwitch));
    $rangeSwitch.change(this._handleRangeSwitchOnChange.bind(this, $rangeSwitch, $currentValueSecondHandle));

    $currentValueFirstHandle.focusout(this._handleCurrentValueFirstHandleFocusOut.bind(this, $currentValueFirstHandle));
    $currentValueSecondHandle.focusout(this._handleCurrentValueSecondHandleFocusOut.bind(this, $currentValueSecondHandle));
    $minimumValue.focusout(this._handleMinimumValueFocusOut.bind(this, $minimumValue));
    $maximumValue.focusout(this._handleMaximumValueFocusOut.bind(this, $maximumValue));
    $stepSizeValue.focusout(this._handleStepSizeValueFocusOut.bind(this, $stepSizeValue));
  }
  _handleSwitchVisibilityTooltipsOnChange($switchVisibilityTooltips) {
    this.panelData.isVisibilityTooltips = $switchVisibilityTooltips.prop('checked');
    this._sendDataToUpdatePlugin();
  }
  _handleOrientationSwitchOnChange($orientationSwitch) {
    this.panelData.isVerticalOrientation = $orientationSwitch.prop('checked');
    this._sendDataToUpdatePlugin();
  }
  _handleRangeSwitchOnChange($rangeSwitch, $currentValueSecondHandle) {
    this.panelData.isIntervalSelection = $rangeSwitch.prop('checked');
    if (this.panelData.isIntervalSelection) {
      $currentValueSecondHandle.removeClass('configuration__current-value_hidden');
      $currentValueSecondHandle.addClass('configuration__current-value_visible');
    } else {
      $currentValueSecondHandle.removeClass('configuration__current-value_visible');
      $currentValueSecondHandle.addClass('configuration__current-value_hidden');
    }
    this._sendDataToUpdatePlugin();
  }
  _handleCurrentValueFirstHandleFocusOut($currentValueFirstHandle) {
    this.panelData.value = parseInt($currentValueFirstHandle.val());
    this._sendDataToUpdatePlugin();
  }
  _handleCurrentValueSecondHandleFocusOut($currentValueSecondHandle) {
    this.panelData.valueRange = parseInt($currentValueSecondHandle.val());
    this._sendDataToUpdatePlugin();
  }
  _handleMinimumValueFocusOut($minimumValue) {
    this.panelData.minimum = parseInt($minimumValue.val());
    this.panelData.value = this.panelData.value < this.panelData.minimum ? this.panelData.minimum : this.panelData.value;
    this.panelData.valueRange = this.panelData.valueRange <= this.panelData.minimum ? this.panelData.maximum : this.panelData.valueRange;
    this._sendDataToUpdatePlugin();
  }
  _handleMaximumValueFocusOut($maximumValue) {
    this.panelData.maximum = parseInt($maximumValue.val());
    this.panelData.valueRange = this.panelData.valueRange > this.panelData.maximum ? this.panelData.maximum : this.panelData.valueRange;
    this.panelData.value = this.panelData.value >= this.panelData.maximum ? this.panelData.minimum : this.panelData.value;
    this._sendDataToUpdatePlugin();
  }
  _handleStepSizeValueFocusOut($stepSizeValue) {
    this.panelData.step = parseInt($stepSizeValue.val());
    this._sendDataToUpdatePlugin();
  }
}

export default ViewPanel;
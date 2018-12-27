import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewPanel extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.panelState = options;
  }

  initPanel() {
    if (this.panelState.isConfigPanelVisible) {
      this._createPanelElement(this.panelState.$slider);

      this.$switchVisibilityTooltips = this.panelState.$slider.find('.js-configuration__visibility-tooltips');
      this.$orientationSwitch = this.panelState.$slider.find('.js-configuration__orientation');
      this.$rangeSwitch = this.panelState.$slider.find('.js-configuration__range');
      this.$currentValueFirstHandle = this.panelState.$slider.find('.js-configuration__current-value_first');
      this.$currentValueSecondHandle = this.panelState.$slider.find('.js-configuration__current-value_second');
      this.$minimumValue = this.panelState.$slider.find('.js-configuration__minimum-value');
      this.$maximumValue = this.panelState.$slider.find('.js-configuration__maximum-value');
      this.$stepSizeValue = this.panelState.$slider.find('.js-configuration__step-size');

      this._initEventListeners();
    }
  }

  updatePanel(panelState) {
    if (this.panelState.isConfigPanelVisible) {
      this.panelState = panelState;

      this.panelState.areTooltipsVisible = panelState.areTooltipsVisible;
      this.panelState.isVerticalOrientation = panelState.isVerticalOrientation;
      this.panelState.hasIntervalSelection = panelState.hasIntervalSelection;

      this._visibilitySecondCurrentValue(this.panelState.hasIntervalSelection);

      this._updatePanelElements();
    }
  }

  _visibilitySecondCurrentValue(isVisible) {
    if (isVisible) {
      this.$currentValueSecondHandle.removeClass('configuration__current-value_hidden');
      this.$currentValueSecondHandle.addClass('configuration__current-value_visible');
    } else {
      this.$currentValueSecondHandle.removeClass('configuration__current-value_visible');
      this.$currentValueSecondHandle.addClass('configuration__current-value_hidden');
    }
  }

  _updatePanelElements() {
    this.$switchVisibilityTooltips.attr({
      checked: this.panelState.areTooltipsVisible ? 'checked' : null,
    });
    this.$orientationSwitch.attr({
      checked: this.panelState.isVerticalOrientation ? 'checked' : null,
    });
    this.$rangeSwitch.attr({
      checked: this.panelState.hasIntervalSelection ? 'checked' : null,
    });
    this.$currentValueFirstHandle.attr({
      step: this.panelState.step,
      min: this.panelState.minimum,
      max: this.panelState.hasIntervalSelection
        ? this.panelState.valueRange - this.panelState.step
        : this.panelState.maximum,
      value: this.panelState.value,
    });
    this.$currentValueSecondHandle.attr({
      step: this.panelState.step,
      min: this.panelState.value + this.panelState.step,
      max: this.panelState.maximum,
      value: this.panelState.valueRange,
    });
    this.$minimumValue.attr({
      step: this.panelState.step,
      max: this.panelState.maximum - this.panelState.step,
      value: this.panelState.minimum,
    });
    this.$maximumValue.attr({
      step: this.panelState.step,
      min: this.panelState.minimum + this.panelState.step,
      value: this.panelState.maximum,
    });
    this.$stepSizeValue.attr({
      min: 1,
      max: this.panelState.maximum - this.panelState.minimum,
      value: this.panelState.step,
    });
  }

  _sendDataToUpdatePlugin() {
    this.notify('updateState', this.panelState);
  }

  _createPanelElement(sliderBlock) {
    this.bookListingTemplate = require('./panelTemplate.hbs');
    const configurationPanel = document.createElement('div');
    configurationPanel.className = 'js-slider__configuration';

    configurationPanel.innerHTML = this.bookListingTemplate({
      elements: [{
        blockClassName: 'configuration',
        checkboxElements: [{
          title: 'Включить флажки',
          inputType: 'checkbox',
          className: 'configuration__visibility-tooltips js-configuration__visibility-tooltips',
        }, {
          title: 'Включить вертикальное отображение',
          inputType: 'checkbox',
          className: 'configuration__orientation js-configuration__orientation',
        }, {
          title: 'Включить выбор интервала',
          inputType: 'checkbox',
          className: 'configuration__range js-configuration__range',
        }],
        inputElements: [
          {
            title: 'Текущее значение',
            className: 'configuration__current-values',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__current-value configuration__current-value_first js-configuration__current-value_first',
            }, {
              inputType: 'number',
              className: 'configuration__current-value configuration__current-value_second js-configuration__current-value_second',
            }],
          }, {
            title: 'Минимальное значение слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__minimum-value js-configuration__minimum-value',
            }],
          }, {
            title: 'Максимальное значение слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__maximum-value js-configuration__maximum-value',
            }],
          }, {
            title: 'Размер шага слайдера',
            valuesInput: [{
              inputType: 'number',
              className: 'configuration__step-size js-configuration__step-size',
            }],
          },
        ],
      }],
    });

    sliderBlock.append(configurationPanel);
  }

  _initEventListeners() {
    this.$switchVisibilityTooltips.change(this._handleSwitchVisibilityTooltipsChange.bind(this));
    this.$orientationSwitch.change(this._handleOrientationSwitchChange.bind(this));
    this.$rangeSwitch.change(this._handleRangeSwitchChange.bind(this));

    this.$currentValueFirstHandle.focusout(this._handleCurrentValueFirstFocusOut.bind(this));
    this.$currentValueSecondHandle.focusout(this._handleCurrentValueSecondFocusOut.bind(this));
    this.$minimumValue.focusout(this._handleMinimumValueFocusOut.bind(this));
    this.$maximumValue.focusout(this._handleMaximumValueFocusOut.bind(this));
    this.$stepSizeValue.focusout(this._handleStepSizeValueFocusOut.bind(this));
  }


  _handleSwitchVisibilityTooltipsChange(e) {
    this.panelState.areTooltipsVisible = $(e.target).prop('checked');

    this._sendDataToUpdatePlugin();
  }

  _handleOrientationSwitchChange(e) {
    this.panelState.isVerticalOrientation = $(e.target).prop('checked');

    this._sendDataToUpdatePlugin();
  }

  _handleRangeSwitchChange(e) {
    this.panelState.hasIntervalSelection = $(e.target).prop('checked');
    this._visibilitySecondCurrentValue(this.panelState.hasIntervalSelection);

    this._sendDataToUpdatePlugin();
  }

  _handleCurrentValueFirstFocusOut(e) {
    this.panelState.value = parseInt($(e.target).val());

    this._sendDataToUpdatePlugin();
  }

  _handleCurrentValueSecondFocusOut(e) {
    this.panelState.valueRange = parseInt($(e.target).val());

    this._sendDataToUpdatePlugin();
  }

  _handleMinimumValueFocusOut(e) {
    this.panelState.minimum = parseInt($(e.target).val());
    this.panelState.value = this.panelState.value < this.panelState.minimum ? this.panelState.minimum : this.panelState.value;
    this.panelState.valueRange = this.panelState.valueRange <= this.panelState.minimum ? this.panelState.maximum : this.panelState.valueRange;

    this._sendDataToUpdatePlugin();
  }

  _handleMaximumValueFocusOut(e) {
    this.panelState.maximum = parseInt($(e.target).val());
    this.panelState.valueRange = this.panelState.valueRange > this.panelState.maximum ? this.panelState.maximum : this.panelState.valueRange;
    this.panelState.value = this.panelState.value >= this.panelState.maximum ? this.panelState.minimum : this.panelState.value;

    this._sendDataToUpdatePlugin();
  }

  _handleStepSizeValueFocusOut(e) {
    this.panelState.step = parseInt($(e.target).val());

    this._sendDataToUpdatePlugin();
  }
}

export default ViewPanel;

import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';
import createArrayOfPossibleHandleValues from '../shared';

class ViewPanel extends EventEmitter {
  constructor($element, isConfigPanelVisible) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = $element;
    this.isConfigPanelVisible = isConfigPanelVisible;
  }

  initPanel() {
    if (this.isConfigPanelVisible) {
      this._createPanelElement(this.$slider);

      this.$switchVisibilityTooltips = this.$slider.find('.js-configuration__visibility-tooltips');
      this.$orientationSwitch = this.$slider.find('.js-configuration__orientation');
      this.$rangeSwitch = this.$slider.find('.js-configuration__range');
      this.$currentValueFirstHandle = this.$slider.find('.js-configuration__current-value_first');
      this.$currentValueSecondHandle = this.$slider.find('.js-configuration__current-value_second');
      this.$minimumValue = this.$slider.find('.js-configuration__minimum-value');
      this.$maximumValue = this.$slider.find('.js-configuration__maximum-value');
      this.$stepSizeValue = this.$slider.find('.js-configuration__step-size');

      this._initEventListeners();
    }
  }

  updatePanel(dataForUpdatePanelState) {
    const { firstValue, secondValue, minimum, maximum, step, areTooltipsVisible, isVerticalOrientation, hasIntervalSelection } = dataForUpdatePanelState;
    this.firstHandleValue = firstValue;
    this.secondHandleValue = secondValue;
    this.minimum = minimum;
    this.maximum = maximum;
    this.step = step;
    this.areTooltipsVisible = areTooltipsVisible;
    this.isVerticalOrientation = isVerticalOrientation;
    this.hasIntervalSelection = hasIntervalSelection;

    this._setVisibilityOfSecondCurrentValue(this.hasIntervalSelection);

    this._updatePanelElements();
  }

  createArrayOfPossibleHandleValues(minimum, maximum, step) {
    let currentValue = minimum;
    const arrayOfPossibleHandleValues = [];

    while (currentValue <= maximum) {
      arrayOfPossibleHandleValues.push(currentValue);
      currentValue += step;
    }
    return arrayOfPossibleHandleValues;
  }

  _setVisibilityOfSecondCurrentValue(isVisible) {
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
      checked: this.areTooltipsVisible
        ? 'checked'
        : null,
    });

    this.$orientationSwitch.attr({
      checked: this.isVerticalOrientation
        ? 'checked'
        : null,
    });

    this.$rangeSwitch.attr({
      checked: this.hasIntervalSelection
        ? 'checked'
        : null,
    });

    this.$currentValueFirstHandle.attr({
      step: this.step,
      min: this.minimum,
      max: this.hasIntervalSelection
        ? this.secondHandleValue - this.step
        : this.maximum,
      value: this.firstHandleValue,
    });
    this.$currentValueFirstHandle.val(this.firstHandleValue);

    this.$currentValueSecondHandle.attr({
      step: this.step,
      min: this.firstHandleValue + this.step,
      max: this.maximum,
      value: this.secondHandleValue,
    });
    this.$currentValueSecondHandle.val(this.secondHandleValue);

    this.$minimumValue.attr({
      step: this.step,
      max: this.maximum - this.step,
      value: this.minimum,
    });

    this.$maximumValue.attr({
      step: this.step,
      min: this.minimum + this.step,
      value: this.maximum,
    });

    this.$stepSizeValue.attr({
      min: 1,
      max: this.maximum - this.minimum,
      value: this.step,
    });
  }

  _sendDataForUpdateState() {
    const panelStateForUpdatePlugin = {
      firstValue: this.firstHandleValue,
      secondValue: this.secondHandleValue,
      minimum: this.minimum,
      maximum: this.maximum,
      step: this.step,
      areTooltipsVisible: this.areTooltipsVisible,
      isVerticalOrientation: this.isVerticalOrientation,
      hasIntervalSelection: this.hasIntervalSelection,
    };

    this.notify('updateState', panelStateForUpdatePlugin);
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
    this.areTooltipsVisible = $(e.target).prop('checked');

    this._sendDataForUpdateState();
  }

  _handleOrientationSwitchChange(e) {
    this.isVerticalOrientation = $(e.target).prop('checked');

    this._sendDataForUpdateState();
  }

  _handleRangeSwitchChange(e) {
    this.hasIntervalSelection = $(e.target).prop('checked');
    this._setVisibilityOfSecondCurrentValue(this.hasIntervalSelection);

    this._sendDataForUpdateState();
  }

  _handleCurrentValueFirstFocusOut(e) {
    this.firstHandleValue = parseInt($(e.target).val());

    this._sendDataForUpdateState();
  }

  _handleCurrentValueSecondFocusOut(e) {
    this.secondHandleValue = parseInt($(e.target).val());

    this._sendDataForUpdateState();
  }

  _handleMinimumValueFocusOut(e) {
    this.minimum = parseInt($(e.target).val());
    this.firstHandleValue = this.firstHandleValue < this.minimum
      ? this.minimum
      : this.firstHandleValue;
    this.secondHandleValue = this.secondHandleValue <= this.minimum
      ? this.maximum
      : this.secondHandleValue;

    this._sendDataForUpdateState();
  }

  _handleMaximumValueFocusOut(e) {
    this.maximum = parseInt($(e.target).val());
    this.secondHandleValue = this.secondHandleValue > this.maximum
      ? this.maximum
      : this.secondHandleValue;
    this.firstHandleValue = this.firstHandleValue >= this.maximum
      ? this.minimum
      : this.firstHandleValue;

    this._sendDataForUpdateState();
  }

  _handleStepSizeValueFocusOut(e) {
    this.step = parseInt($(e.target).val());
    const arrayOfPossibleHandleValues = createArrayOfPossibleHandleValues(this.minimum, this.maximum, this.step);

    this.firstHandleValue = arrayOfPossibleHandleValues.includes(this.firstHandleValue)
      ? this.firstHandleValue
      : arrayOfPossibleHandleValues[0];

    this.secondHandleValue = arrayOfPossibleHandleValues.includes(this.secondHandleValue)
      ? this.secondHandleValue
      : arrayOfPossibleHandleValues[arrayOfPossibleHandleValues.length - 1];

    this._sendDataForUpdateState();
  }
}

export default ViewPanel;

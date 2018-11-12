import jQuery from 'jquery';

import Model from './Model/Model';
import ViewSlider from './ViewSlider/ViewSlider';
import ViewPanel from './ViewPanel/ViewPanel';
import Controller from './Controller/Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const { slider, visibilityTooltips, verticalOrientation, rangeStatus, value, valueRange } = options;
    const viewSliderOptions = { slider, visibilityTooltips, verticalOrientation, rangeStatus, value, valueRange };

    const viewPanelOptions = options;

    const stateOptions = {
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      rangeStatus: options.rangeStatus,
      visibilityTooltips: options.visibilityTooltips,
      verticalOrientation: options.verticalOrientation,
    };

    const model = new Model(stateOptions);
    const viewSlider = new ViewSlider(viewSliderOptions);
    const viewPanel = new ViewPanel(viewPanelOptions);
    const controller = new Controller();

    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewPanel);
    controller.initPlugin();
  };
}(jQuery));

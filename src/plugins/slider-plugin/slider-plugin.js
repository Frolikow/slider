import jQuery from 'jquery';

import Model from './Model/Model';
import ViewSlider from './ViewSlider/ViewSlider';
import ViewPanel from './ViewPanel/ViewPanel';
import Controller from './Controller/Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const stateOptions = {
      firstValue: options.firstValue,
      secondValue: options.secondValue,
      minimum: options.minimum,
      maximum: options.maximum,
      step: options.step,
      areTooltipsVisible: options.areTooltipsVisible,
      isVerticalOrientation: options.isVerticalOrientation,
      hasIntervalSelection: options.hasIntervalSelection,
    };

    const model = new Model();
    const viewSlider = new ViewSlider(options.$slider);
    const viewPanel = new ViewPanel(options.$slider, options.isConfigPanelVisible);
    const controller = new Controller();

    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewPanel);

    controller.initPlugin(stateOptions);
  };
}(jQuery));

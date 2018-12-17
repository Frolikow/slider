import jQuery from 'jquery';

import Model from './Model/Model';
import ViewSlider from './ViewSlider/ViewSlider';
import ViewPanel from './ViewPanel/ViewPanel';
import Controller from './Controller/Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const panelOptions = { ...options };

    const stateOptions = {
      isConfigPanelVisible: options.isConfigPanelVisible,
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      areTooltipsVisible: options.areTooltipsVisible,
      isVerticalOrientation: options.isVerticalOrientation,
      hasIntervalSelection: options.hasIntervalSelection,
    };

    const model = new Model(stateOptions);
    const viewSlider = new ViewSlider(options.$slider);
    const viewPanel = new ViewPanel(panelOptions);
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

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

    const model = new Model(stateOptions);
    const viewSlider = new ViewSlider($(this));
    const viewPanel = new ViewPanel(this, options.isConfigPanelVisible);
    const controller = new Controller();

    model.subscribe(controller);
    controller.subscribe(model);

    viewSlider.subscribe(controller);
    controller.subscribe(viewSlider);

    viewPanel.subscribe(controller);
    controller.subscribe(viewPanel);

    controller.initPlugin();
  };
}(jQuery));

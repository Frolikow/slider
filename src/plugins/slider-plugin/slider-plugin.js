import jQuery from 'jquery';

import Model from './Model/Model';
import ViewSlider from './ViewSlider/ViewSlider';
import ViewPanel from './ViewPanel/ViewPanel';
import Controller from './Controller/Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const sliderOptionsView = {
      slider: options.slider,
    };

    const panelOptionsView = {
      slider: options.slider,
      visibilityConfigPanel: options.visibilityConfigPanel,
    };

    const stateOptions = { ...options };
    delete stateOptions.slider;

    const model = new Model(stateOptions);
    const viewSlider = new ViewSlider(sliderOptionsView);
    const viewPanel = new ViewPanel(panelOptionsView);
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

import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewConfiguration from './ViewConfiguration';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const model = new Model(options);
    const viewSlider = new ViewSlider();
    const viewControlPanel = new ViewConfiguration();
    const controller = new Controller();

    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewControlPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewControlPanel);
    controller.initViews();
  };
}(jQuery));

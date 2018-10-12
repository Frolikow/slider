import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewPanel from './ViewPanel';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const model = new Model(options);
    const viewSlider = new ViewSlider();
    const viewPanel = new ViewPanel();
    const controller = new Controller();

    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewPanel);
    controller.initViews();
  };
}(jQuery));

import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewConfiguration from './ViewConfiguration';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    // const model = new Model(options); //-
    // const view = new ViewSlider(this);
    // const viewConfiguration = new ViewConfiguration(options, this);
    // const controller = new Controller(model, view, viewConfiguration, this);

    const model = new Model();
    const viewSlider = new ViewSlider(options, this);
    const viewControlPanel = new ViewConfiguration(options, this);
    const controller = new Controller();
    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewControlPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewControlPanel);
  };
}(jQuery));

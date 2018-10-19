import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewPanel from './ViewPanel';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const { slider, visibilityConfigPanel, visibilityTooltips, verticalOrientation, rangeStatus } = options;
    const viewOptions = { slider, visibilityConfigPanel, visibilityTooltips, verticalOrientation, rangeStatus };
    const { minimum, maximum, value, valueRange, step } = options;
    const stateOptions = { minimum, maximum, value, valueRange, step };
    console.log(viewOptions);
    console.log(stateOptions);

    const model = new Model(stateOptions);
    const viewSlider = new ViewSlider(viewOptions);
    const viewPanel = new ViewPanel(viewOptions);
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

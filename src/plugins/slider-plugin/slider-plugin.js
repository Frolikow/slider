import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewConfiguration from './ViewConfiguration';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const model = new Model(options);
    const view = new ViewSlider(this);
    const viewConfiguration = new ViewConfiguration(options, this);
    const controller = new Controller(model, view, viewConfiguration, this);
  };
}(jQuery));


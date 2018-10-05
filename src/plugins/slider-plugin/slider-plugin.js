import jQuery from 'jquery';

import Model from './Model';
import ViewSlider from './ViewSlider';
import ViewConfiguration from './ViewConfiguration';
import Controller from './Controller';

(function ($) {
  $.fn.efSlider = function (options) {
    const model = new Model();
    const viewSlider = new ViewSlider();
    const viewControlPanel = new ViewConfiguration();
    const controller = new Controller();

    model.subscribe(controller);
    viewSlider.subscribe(controller);
    viewControlPanel.subscribe(controller);
    controller.subscribe(model);
    controller.subscribe(viewSlider);
    controller.subscribe(viewControlPanel);
    model.initState(options);
  };
}(jQuery));
// все опции от пользователя(начальные) передаются в модель и только из модели рассылаются по вьюхам
// если во вьюхах изменения то они (изменения) летят в модель, там обновляют весь обект options и
//  также весь объект летит обратно во вьюхи и запускает отрисовку с новыми данными

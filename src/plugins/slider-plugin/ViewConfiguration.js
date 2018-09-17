class ViewConfiguration {
  constructor(options, thisForViewConfiguration) {
    this.createConfigurationPanel(options, thisForViewConfiguration);
  }

  createConfigurationPanel(options, thisForViewConfiguration) {
    if (options.showConfigPanel === true) {
      thisForViewConfiguration.after('<div class="slider__configuration">'
        + '<div class="configuration">'

        + '<label> <input type="checkbox" class="configuration__show-handle-value">Убрать флажок</label>'
        + '<label> <input type="checkbox" class="configuration__orientation">Включить вертикальное отображение</label>'
        + '<label> <input type="checkbox"  class="configuration__range">Включить выбор интервала</label>'

        + '<label>Текущее значение</label> <div class="configuration__current-value">'
        + '<input type="number" class="configuration__current-value"> <input type="number" class="configuration__current-value-range"> </div>'
        + '<label>Минимальное значение слайдера</label> <input type="number" class="configuration__minimum-value">'
        + '<label>Максимальное значение слайдера</label> <input type="number" class="configuration__maximum-value">'
        + '<label>Размер шага слайдера</label> <input type="number" class="configuration__size-of-step">');
    }
  }
}

export default ViewConfiguration;

import EventEmitter from '../eventEmiter/eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }

  initPlugin(dataForRendering) {
    const dataForSliderRendering = { ...dataForRendering };
    delete dataForSliderRendering.isConfigPanelVisible;
    const dataForPanelRendering = { ...dataForRendering };

    this.notify('initSlider', dataForSliderRendering);
    this.notify('initPanel', dataForPanelRendering);

    const dataForUpdatePluginState = { ...dataForRendering };
    delete dataForUpdatePluginState.$slider;
    this.notify('updateState', dataForUpdatePluginState);
  }

  sendNewDataFromModel(newData) {
    const {
      value,
      valueRange,
      minimum,
      maximum,
      step,
      isConfigPanelVisible,
      hasIntervalSelection,
      isVerticalOrientation,
      areTooltipsVisible,
    } = newData;

    const dataForSlider = { value, valueRange, minimum, maximum, step, hasIntervalSelection, isVerticalOrientation, areTooltipsVisible };
    const dataForPanel = { value, valueRange, minimum, maximum, step, hasIntervalSelection, isVerticalOrientation, isConfigPanelVisible, areTooltipsVisible };

    this.updateSlider(dataForSlider);
    this.updatePanel(dataForPanel);
  }

  updateSlider(dataSlider) {
    this.notify('updateSlider', dataSlider);
  }

  updatePanel(dataPanel) {
    this.notify('updatePanel', dataPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }
}

export default Controller;

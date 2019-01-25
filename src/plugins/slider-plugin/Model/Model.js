import EventEmitter from '../eventEmiter/eventEmiter';
import { validateInitialData, validateIncomingData } from './modelDataValidators';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = validateInitialData(options);
  }

  updateState(newDataToUpdateState) {
    this.modelData = { ...this.modelData, ...validateIncomingData({ ...this.modelData, ...newDataToUpdateState }) };

    this.sendNewDataFromModel();
  }

  sendNewDataFromModel() {
    this.notify('sendNewDataFromModel', this.modelData);
  }
}

export default Model;

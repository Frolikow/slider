import EventEmitter from '../eventEmiter/eventEmiter';
import { validateInitialData, validateIncomingData } from './modelDataValidators';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = validateInitialData(options);
  }

  updateState(newDataToUpdateState) {
    this.modelData = { ...this.modelData, ...validateIncomingData(newDataToUpdateState) };

    this.sendNewDataFromModel();
  }

  sendNewDataFromModel() {
    const newData = { ...this.modelData };

    this.notify('sendNewDataFromModel', newData);
  }
}

export default Model;

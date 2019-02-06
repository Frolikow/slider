import Model from '../Model';
import EventEmmiter from '../../eventEmiter/eventEmiter';

const mockOptions = {
  minimum: 1,
  maximum: 10,
  firstValue: 5,
  secondValue: 8,
  step: 1,
  hasIntervalSelection: true,
  areTooltipsVisible: true,
  isVerticalOrientation: true,
};
const model = new Model(mockOptions);

const sendNewDataFromModel = jest.spyOn(Model.prototype, '_sendNewDataFromModel');

describe('Тестирование методов Model', () => {

  describe('Тестирование метода updateState', () => {
    test('Метод обновляет глобальные переменные, вызывает метод validateIncomingData для проверки новых данных и вызывает метод sendNewDataFromModel для обновления вьюх', () => {
      const mockOptions = {
        minimum: 1,
        maximum: 10,
        firstValue: 2,
        secondValue: 8,
      };
      const wrongMockOptions = {
        minimum: 1,
        maximum: -5,
        firstValue: 15,
        secondValue: 0,
      };

      model.updateState(wrongMockOptions);

      expect(model.modelData.firstValue).toEqual(mockOptions.minimum)
      expect(model.modelData.secondValue).toEqual(mockOptions.maximum)
      expect(model.modelData.maximum).toEqual(mockOptions.maximum)

      expect(sendNewDataFromModel).toHaveBeenCalledTimes(1);
    })
  });
});

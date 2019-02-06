
import Controller from '../Controller';
import EventEmmiter from '../../eventEmiter/eventEmiter';

const controller = new Controller();
const notify = jest.spyOn(EventEmmiter.prototype, 'notify');
const updateSlider = jest.spyOn(Controller.prototype, '_updateSlider');
const updatePanel = jest.spyOn(Controller.prototype, '_updatePanel');

describe('Тестирование методов controller', () => {
  const mockData = {
    firstValue: 4,
    secondValue: 8,
    minimum: 1,
    maximum: 10,
    step: 1,
    isVerticalOrientation: false,
    areTooltipsVisible: false,
    hasIntervalSelection: true,
  }
  describe('Тестирование метода initPlugin', () => {
    test('Метод трижды вызвает родительский метод "notify" с аргументами для инициализации вьюх и обновления состояния плагина', () => {
      controller.initPlugin();

      expect(notify).toBeCalledWith('initSlider')
      expect(notify).toBeCalledWith('initPanel')
      expect(notify).toBeCalledWith('updateState')
      expect(notify).toHaveBeenCalledTimes(3);
    })
  });


  describe('Тестирование метода sendNewDataFromModel', () => {
    test('Метод вызвает методы updateSlider, updatePanel передавая туда данные для обновления newData', () => {

      controller.sendNewDataFromModel(mockData);

      expect(updateSlider).toBeCalledWith(mockData);
      expect(updateSlider).toHaveBeenCalledTimes(1);
      expect(updatePanel).toBeCalledWith(mockData);
      expect(updatePanel).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода updateState', () => {
    test('Метод вызвает родительский метод "notify" с аргументами для обновления состояния плагина', () => {

      controller.updateState(mockData);

      expect(notify).toBeCalledWith('updateState', mockData)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });
});



import Controller from '../Controller';
import EventEmmiter from '../../eventEmiter/eventEmiter';

const controller = new Controller();
const notify = jest.spyOn(EventEmmiter.prototype, 'notify');

describe('Тестирование методов controller', () => {

  describe('Тестирование метода calculateIndexOfRelativeCoordinates', () => {
    test('Метод расчитывает индекс для перерасчета данных между видами и моделью', () => {
      const testWidth = 480;

      controller.calculateIndexOfRelativeCoordinates(testWidth)

      expect(controller.indexOfRelativeValues).toEqual(testWidth / 1000)
    })
  });

  describe('Тестирование метода initPlugin', () => {
    test('Метод дважды вызвает метод "notify" с разными аргументами', () => {
      controller.initPlugin();

      expect(notify).toBeCalledWith('initSlider')
      expect(notify).toBeCalledWith('sendNewDataFromModel')
      expect(notify).toHaveBeenCalledTimes(2);
    })
  });

  describe('Тестирование метода updateSlider', () => {
    test('Метод перерасчитывает значения и отправляет данные в вид слайдера через notify', () => {
      const mockData = {
        value: 2,
        valueRange: 6,
        firstRelativePosition: 10,
        secondRelativePosition: 60,
        rangeStatus: true,
        visibilityTooltips: true,
        verticalOrientation: true,
      }
      const mockDataAfterConvert = {
        value: mockData.value,
        valueRange: mockData.valueRange,
        firstPosition: controller._convertValuesForViews(mockData.firstRelativePosition),
        secondPosition: controller._convertValuesForViews(mockData.secondRelativePosition),
        rangeStatus: mockData.rangeStatus,
        visibilityTooltips: mockData.visibilityTooltips,
        verticalOrientation: mockData.verticalOrientation,
      };

      controller.updateSlider(mockData);

      expect(mockData).toEqual(mockDataAfterConvert);
      expect(notify).toBeCalledWith('updateSlider', mockData)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода updatePanel', () => {
    test('Метод отправляет данные в вид панели через notify', () => {
      const mockData = {
        value: 2,
        valueRange: 8,
        minimum: 1,
        maximum: 12,
        step: 1,
      }

      controller.updatePanel(mockData);

      expect(notify).toBeCalledWith('updatePanel', mockData)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода updateState', () => {
    test('Метод отправляет в модель данные для обновления состояния', () => {
      const mockData = {
        value: 4,
        valueRange: 8,
        minimum: 1,
        maximum: 10,
        step: 1,
        rangeStatus: true,
        verticalOrientation: false,
        visibilityTooltips: false,
      }

      controller.updateState(mockData);

      expect(notify).toBeCalledWith('updateState', mockData)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода sendCoordinatesWhenClick', () => {
    test('Метод конвертуриует координаты клика по слайдеру и отправляет в модель для расчетов', () => {
      const mockCoordinates = 100;
      const mockRelativeCoordinates = controller._convertValuesForModel(mockCoordinates);

      controller.sendCoordinatesWhenClick(mockCoordinates)

      expect(mockRelativeCoordinates).toEqual(mockCoordinates / controller.indexOfRelativeValues);
      expect(notify).toBeCalledWith('updateValuesForStaticCoordinates', mockRelativeCoordinates)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода sendCoordinatesWhenMoving', () => {
    test('Метод конвертирует координаты для модели и отправляет данные в модель для расчетов', () => {
      const mockData = {
        coordinates: 100,
        elementType: 'first',
        rangeStatus: true,
      }
      const mockDataAfterConvert = {
        relativeCoordinates: controller._convertValuesForModel(mockData.coordinates),
        elementType: mockData.elementType,
        rangeStatus: mockData.rangeStatus,
      }

      controller.sendCoordinatesWhenMoving(mockData);

      expect(mockData).toEqual(mockDataAfterConvert);
      expect(notify).toBeCalledWith('updateValuesForDynamicCoordinates', mockData)
      expect(notify).toHaveBeenCalledTimes(1);
    })
  });
});


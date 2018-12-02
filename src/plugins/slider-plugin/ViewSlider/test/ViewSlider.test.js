import EventEmmiter from '../../eventEmiter/eventEmiter'
import ViewSlider from '../ViewSlider';

const mockOptions = { minimum: 1, maximum: 10, value: 5, valueRange: 8, step: 1 };
const viewSlider = new ViewSlider(mockOptions);

document.body.innerHTML = '<div class="slider"></div>'
const $ = require('jquery');

const notify = jest.spyOn(EventEmmiter.prototype, 'notify');
const createSliderElement = jest.spyOn(ViewSlider.prototype, '_createSliderElement');
const eventHandlers = jest.spyOn(ViewSlider.prototype, '_eventHandlers');

const enableVisibilityTooltips = jest.spyOn(ViewSlider.prototype, '_enableVisibilityTooltips');
const orientationChange = jest.spyOn(ViewSlider.prototype, '_orientationChange');
const enableRangeSelection = jest.spyOn(ViewSlider.prototype, '_enableRangeSelection');
const setHandlePositionAndHandleValue = jest.spyOn(ViewSlider.prototype, '_setHandlePositionAndHandleValue');

describe('Тестирование методов viewSlider', () => {
  describe('Тестирование метода initSlider', () => {
    test('Метод вызывает приватный метод для создания слайдера, инициализирует элементы слайдера, вешает обработчики событий, и отправляет ширину слайдера в контроллер для создания расчетного коэффициента', () => {
      viewSlider.slider = $('.slider');

      viewSlider.initSlider()

      expect(createSliderElement).toHaveBeenCalledTimes(1);
      expect(viewSlider.scaleWidth).not.toBeUndefined();
      expect(notify).toHaveBeenCalledTimes(1);
      expect(notify).toHaveBeenCalledWith('calculateIndexOfRelativeCoordinates', viewSlider.scaleWidth)
      expect(eventHandlers).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода updateSlider', () => {
    viewSlider.visibilityTooltips = false;
    viewSlider.verticalOrientation = false;
    viewSlider.rangeStatus = false;
    test('Метод должен вызвать три приватных метода(с глобальными свойствами) для отрисовки слайдера, при передаче пустого объекта', () => {
      const mockDataForUpdateSlider = {};

      viewSlider.updateSlider(mockDataForUpdateSlider);

      expect(enableVisibilityTooltips).toHaveBeenCalledTimes(1);
      expect(enableVisibilityTooltips).toHaveBeenCalledWith(viewSlider.visibilityTooltips);

      expect(orientationChange).toHaveBeenCalledTimes(1);
      expect(orientationChange).toHaveBeenCalledWith(viewSlider.verticalOrientation);

      expect(enableRangeSelection).toHaveBeenCalledTimes(1);
      expect(enableRangeSelection).toHaveBeenCalledWith(viewSlider.rangeStatus);
    });

    describe('Метод должен вызвать приватный метод(1 или, если включен интревал, 2раза)', () => {
      const mockDataForUpdateSlider = {
        value: 2,
        valueRange: 6,
        firstPosition: 100,
        secondPosition: 500,
        rangeStatus: true,
      };
      const mockDataForSetPositionHandle = {
        value: mockDataForUpdateSlider.value,
        valueRange: mockDataForUpdateSlider.valueRange,
        coordinatesFirstHandle: mockDataForUpdateSlider.firstPosition,
        coordinatesSecondHandle: mockDataForUpdateSlider.secondPosition,
        elementType: 'first',
      };

      beforeEach(() => {
        setHandlePositionAndHandleValue.mockClear();
      });

      test('Проверка при отключенном интервале', () => {
        mockDataForUpdateSlider.rangeStatus = false;
        
        viewSlider.updateSlider(mockDataForUpdateSlider);
        
        expect(setHandlePositionAndHandleValue).toHaveBeenCalledTimes(1);
        expect(setHandlePositionAndHandleValue).toHaveBeenCalledWith(mockDataForSetPositionHandle);
      });
      
      test('Проверка при включенном интервале', () => {
        mockDataForUpdateSlider.rangeStatus = true;
        mockDataForSetPositionHandle.elementType = 'second';
        
        viewSlider.updateSlider(mockDataForUpdateSlider);
        
        expect(setHandlePositionAndHandleValue).toHaveBeenNthCalledWith(2, mockDataForSetPositionHandle);
        expect(setHandlePositionAndHandleValue).toHaveBeenCalledTimes(2);
      });
    })
  })
});

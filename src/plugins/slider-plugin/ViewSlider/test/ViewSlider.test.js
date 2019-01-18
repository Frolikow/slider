import EventEmmiter from '../../eventEmiter/eventEmiter'
import ViewSlider from '../ViewSlider';

document.body.innerHTML = '<div class="slider"></div>'
const $ = require('jquery');

const viewSlider = new ViewSlider($('.slider'));

const createSliderElement = jest.spyOn(ViewSlider.prototype, '_createSliderElement');
const initEventListeners = jest.spyOn(ViewSlider.prototype, '_initEventListeners');

const setTooltipsVisibility = jest.spyOn(ViewSlider.prototype, '_setTooltipsVisibility');
const setOrientation = jest.spyOn(ViewSlider.prototype, '_setOrientation');
const setIntervalSelection = jest.spyOn(ViewSlider.prototype, '_setIntervalSelection');
const setHandlePosition = jest.spyOn(ViewSlider.prototype, '_setHandlePosition');

describe('Тестирование методов viewSlider', () => {
  describe('Тестирование метода initSlider', () => {

    test('Метод вызывает приватный метод для создания слайдера, инициализирует элементы слайдера, вешает обработчики событий', () => {

      viewSlider.initSlider()

      expect(viewSlider.scaleWidth).not.toBeUndefined()
      expect(createSliderElement).toHaveBeenCalledTimes(1);
      expect(initEventListeners).toHaveBeenCalledTimes(1);
    })
  });

  describe('Тестирование метода updateSlider', () => {
    const mockData = {
      firstValue: 4,
      secondValue: 8,
      minimum: 1,
      maximum: 10,
      step: 1,
      areTooltipsVisible: false,
      isVerticalOrientation: false,
      hasIntervalSelection: true,
    }

    test('Метод устанавливает новые свойства класса, и вызывает методы для отрисовки слайдера с новыми свойствами', () => {

      viewSlider.updateSlider(mockData);

      expect(setTooltipsVisibility).toHaveBeenCalledTimes(1);
      expect(setTooltipsVisibility).toHaveBeenCalledWith(viewSlider.areTooltipsVisible);

      expect(setOrientation).toHaveBeenCalledTimes(1);
      expect(setOrientation).toHaveBeenCalledWith(viewSlider.isVerticalOrientation);

      expect(setIntervalSelection).toHaveBeenCalledTimes(1);
      expect(setIntervalSelection).toHaveBeenCalledWith(viewSlider.hasIntervalSelection);
    });

    describe('Метод должен вызвать приватный метод _setHandlePosition (1 или, если включен интревал, 2 раза)', () => {
      let mockDataSetHandlePosition = { ...mockData };

      beforeEach(() => {
        setHandlePosition.mockClear();
      });

      test('Проверка при отключенном интервале', () => {
        mockDataSetHandlePosition.hasIntervalSelection = false;

        viewSlider.updateSlider(mockDataSetHandlePosition);

        expect(setHandlePosition).toHaveBeenCalledWith(viewSlider.$firstHandle, viewSlider.$firstTooltip, viewSlider.firstHandleValue);
        expect(setHandlePosition).toHaveBeenCalledTimes(1);
      });

      test('Проверка при включенном интервале', () => {
        mockDataSetHandlePosition.hasIntervalSelection = true;

        viewSlider.updateSlider(mockDataSetHandlePosition);

        expect(setHandlePosition).toHaveBeenNthCalledWith(2, viewSlider.$secondHandle, viewSlider.$secondTooltip, viewSlider.secondHandleValue);
        expect(setHandlePosition).toHaveBeenCalledTimes(2);
      });
    })
  })
});

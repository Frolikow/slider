
import Model from '../Model';

const mockOptions = { minimum: 1, maximum: 10, value: 5, valueRange: 8, step: 1 };
const assert = require('assert');
const model = new Model(mockOptions);
const testFunc = model.checkTest;

describe('math', () => {

  function makeKitTest(a, b) {
    let value = a + b;
    it(`${a} + ${b} = ${value}`, () => {
      assert.equal(testFunc(a, b), value);
    });
  }
  describe('secondTest', () => {
    let x = 0, y = 0, i = 1;
    while (i < 10) {
      i += 1;
      x += 9;
      y += 9;
      makeKitTest(x, y);
    }
  });
});

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../../../_lib/buildLocalizeFn/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eraValues = {
  narrow: ['пр.н.е.', 'н.е.'],
  abbreviated: ['пред н. е.', 'н. е.'],
  wide: ['пред нашата ера', 'нашата ера']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['1-ви кв.', '2-ри кв.', '3-ти кв.', '4-ти кв.'],
  wide: ['1-ви квартал', '2-ри квартал', '3-ти квартал', '4-ти квартал']
};
var monthValues = {
  abbreviated: ['јан', 'фев', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'септ', 'окт', 'ноем', 'дек'],
  wide: ['јануари', 'февруари', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септември', 'октомври', 'ноември', 'декември']
};
var dayValues = {
  narrow: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
  short: ['не', 'по', 'вт', 'ср', 'че', 'пе', 'са'],
  abbreviated: ['нед', 'пон', 'вто', 'сре', 'чет', 'пет', 'саб'],
  wide: ['недела', 'понеделник', 'вторник', 'среда', 'четврток', 'петок', 'сабота']
};
var dayPeriodValues = {
  wide: {
    am: 'претпладне',
    pm: 'попладне',
    midnight: 'полноќ',
    noon: 'напладне',
    morning: 'наутро',
    afternoon: 'попладне',
    evening: 'навечер',
    night: 'ноќе'
  }
};

function ordinalNumber(dirtyNumber) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;

  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + '-ви';

      case 2:
        return number + '-ри';

      case 7:
      case 8:
        return number + '-ми';
    }
  }

  return number + '-ти';
}

var localize = {
  ordinalNumber: ordinalNumber,
  era: (0, _index.default)({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: (0, _index.default)({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function (quarter) {
      return Number(quarter) - 1;
    }
  }),
  month: (0, _index.default)({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: (0, _index.default)({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: (0, _index.default)({
    values: dayPeriodValues,
    defaultWidth: 'wide'
  })
};
var _default = localize;
exports.default = _default;
module.exports = exports.default;
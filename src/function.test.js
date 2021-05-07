import {calculateRewards, assignToMonth, sumMonthly, checkAmount, checkDate, check} from './function';


//const 'functionname' = require(./pathofjs);
it('calculates the reward point value from transaction amount', () => {
    expect(calculateRewards(120)).toBe(90);
    expect(calculateRewards(50)).toBe(0);
    expect(calculateRewards(100)).toBe(50);
  });

it('assigns reward point values to the correct months', () => {
  const transaction1 = {
    transactionId:1, 
    customerId:"Unit Test", 
    transactionAmount: 51, 
    date:1,
    year:2020
  };
  const transaction2 = {
    transactionId:2, 
    customerId:"Unit Test", 
    transactionAmount: 55, 
    date:2,
    year:2020
  };
  const transaction3 = {
    transactionId:3, 
    customerId:"Unit Test", 
    transactionAmount: 59, 
    date:3,
    year:2020
  };
  const transaction4 = {
    transactionId:3, 
    customerId:"Unit Test", 
    transactionAmount: 51, 
    date:3,
    year:2020
  };
  const transaction5 = {
    transactionId:3, 
    customerId:"Unit Test", 
    transactionAmount: 59, 
    date:3,
    year:2021
  };
  
  const ledger1 = {transaction1, transaction2, transaction3};
  const ledger2 = {transaction1, transaction2, transaction3, transaction4};
  const ledger3 = {transaction3, transaction5};

  let expected = [{calendar:1, year:2020, value:1}, {calendar:2, year:2020, value:5}, {calendar:3, year:2020, value:9}];
  expect(assignToMonth(ledger1)).toEqual(expected);

  expected = [{calendar:1, year:2020, value:1}, {calendar:2, year:2020, value:5}, {calendar:3, year:2020, value:10}];
  expect(assignToMonth(ledger2)).toEqual(expected);

  expected = [{calendar:3, year:2020, value:9}, {calendar:3, year:2021, value:9}];
  expect(assignToMonth(ledger3)).toEqual(expected);
});

it('sums reward point values from all months', () => {
  let monthInput = [
    {calendar:1, year:2020, value:1}, 
    {calendar:2, year:2020, value:5}, 
    {calendar:3, year:2020, value:9}
  ];
  
  let output = sumMonthly(monthInput);
  expect(output).toEqual(15);
});

it('validates transaction date input', () => {
  expect(checkDate('1/10/2010')).toBe(true);
  expect(() => {checkDate('1/as/2010')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('dd/10/2010')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('1/10/dd')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('13/10/2010')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('0/10/2010')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('1/32/2010')}).toThrow('Invalid date in entry:');
  expect(() => {checkDate('1/0/2010')}).toThrow('Invalid date in entry:');
});

it('validates transaction amount input', () => {
  expect(checkAmount(10)).toBe(true);
  expect(() => {checkAmount(100000000000000)}).toThrow('Transaction amount out of range (Maximum 1000000):');
  expect(() => {checkAmount(-12)}).toThrow('Transaction amount out of range (Maximum 1000000):');
  expect(() => {checkAmount('1as3d')}).toThrow('Invalid transaction amount:');
});

it('validates data formatting', () => {
  window.alert = jest.fn();
  window.alert.mockClear();
  expect(check(['1234','Unit Test', '100', '1/10/2010'], '1234, Unit Test, 100, 1/10/2010')).toBe(true);
  expect(check(['Unit Test', '100', '1/10/2010'], 'Unit Test, 100, 1/10/2010')).toBe(false);
  expect(check(['1234','Unit Test', '100', '1/10/2010', '10'], '1234, Unit Test, 100, 1/10/2010, 10')).toBe(false);
});
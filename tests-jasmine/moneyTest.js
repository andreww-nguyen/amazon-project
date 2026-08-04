import {formatCurrency} from '../scripts/utils/money.js';

// create test suite
describe('test suite: formatCurrency', () =>
{
  // create test 1
  it('converts cents into dollars', () =>
  {
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  // create test 2
  it('works with 0', () =>
  {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  // create test 3
  it('round up to nearest cent', () =>
  {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });
});
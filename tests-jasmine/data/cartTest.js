import {addToCart, cart, loadFromStorage} from '../../data/cart.js';

// create test suite
describe('test suite: addToCart', () =>
{
  // create test 1
  it('adds an existing product to the cart', () =>
  {
    // mock localStorage.setitem
    spyOn(localStorage, 'setItem');

    // mock localStorage.getItem to return a cart with an existing item
    spyOn(localStorage, 'getItem').and.callFake(() =>
    {
      return JSON.stringify(
      [
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 1,
          deliveryOptionId: '1'
        }
      ]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  // create test 2
  it ('adds a new product to the cart', () =>
  {
    // mock localStorage.setitem
    spyOn(localStorage, 'setItem');
    
    // mock localStorage.getItem to return an empty array
    spyOn(localStorage, 'getItem').and.callFake(() =>
    {
      return JSON.stringify([]);
    });
    console.log(localStorage.getItem('cart'));

    // when reloading the cart, the cart will be an empty array
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});
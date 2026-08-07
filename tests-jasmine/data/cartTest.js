import { cart } from '../../data/cart.js';

// create test suite
describe('test suite: addToCart', () =>
{
  beforeEach(() =>
  {
    // mock localStorage.setitem
    spyOn(localStorage, 'setItem');

  });
  // create test 1
  it('adds an existing product to the cart', () =>
  {
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
    cart.loadFromStorage();

    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.getCartItems().length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(
    [
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }
    ]));
    expect(cart.getCartItems()[0].getProductId()).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.getCartItems()[0].getQuantity()).toEqual(2);
  });

  // create test 2
  it ('adds a new product to the cart', () =>
  {

    // mock localStorage.getItem to return an empty array
    spyOn(localStorage, 'getItem').and.callFake(() =>
    {
      return JSON.stringify([]);
    });
    console.log(localStorage.getItem('cart'));

    // when reloading the cart, the cart will be an empty array
    cart.loadFromStorage();

    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.getCartItems().length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(
    [
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }
    ]
    ));
    expect(cart.getCartItems()[0].getProductId()).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.getCartItems()[0].getQuantity()).toEqual(1);
  });

  it('removeFromCart() works', () =>
  {
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
    })
    cart.loadFromStorage();
    cart.removeFromCart('invalidId');
    expect(cart.getCartItems().length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(
    [
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }
    ]
    ));

    cart.removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.getCartItems().length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });
});
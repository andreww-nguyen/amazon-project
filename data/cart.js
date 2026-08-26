import { products } from './products.js'

class Cart
{
  #cartItems;
  #localStorageKey; 

  constructor(localStorageKey)
  {
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  /**
   * loads the cart from the memory in local storage
   */
  loadFromStorage()
  {
    this.#cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey))

    if (!this.#cartItems)
    {
      this.#cartItems = [];
    }
    else
    {
      // only restore classes for data that came from storage (plain objects from JSON.parse)
      this.#cartItems = this.#cartItems.map((item) =>
      {
        const cartItem = new CartItem(item.productId, item.quantity);
        cartItem.setDeliveryOptionId(item.deliveryOptionId);
        return cartItem;
      });
    }
  }

  /**
   * saves the current cart to local storage
   */
  saveToStorage()
  {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }

  /**
   * uses the ID to add the new/existing item to the cart.
   * Adds the selected number of items that the user specified using the 
   * drop-down menu
   * 
   * @param {string} productId the ID associated with the product
   * @param {number} productQuantity the number of items to add to the cart
   */
  addToCart(productId, productQuantity)
  {
    // check if the product already exists in the cart
    let matchingItem;
    let oldQuantity;
    this.#cartItems.forEach((item) =>
    {
      if (productId === item.getProductId())
      {
        matchingItem = item;
        oldQuantity = item.getQuantity();
      }
    });

    // increase the quantity of the item that is already in the cart
    if (matchingItem)
    {
      matchingItem.setQuantity(productQuantity + oldQuantity);
    }

    // add the new product to the cart
    else
    {
      // find the item in the products
      this.#cartItems.push(new CartItem(productId, productQuantity));
    }

    // save the cart to storage
    this.saveToStorage();
  }

  /**
   * uses a product's ID to remove the item from the car
   * 
   * @param {string} productId the ID associated with the product
   */
  removeFromCart(productId)
  {
    // create a new array, but filter out the item with the same productId
    const newCart = this.#cartItems.filter(cartItem => cartItem.getProductId() !== productId);

    // set our cart to newCart
    this.#cartItems = newCart;

    // save the cart to local storage
    this.saveToStorage();
  }

  /**
   * loops through the cart and locates the item based on the ID.
   * Then, the item's quantity is changed to the newQuantity
   * 
   * @param {string} productId the ID associated with the product
   * @param {number} newQuantity the specified quantity the user wants to change to
   */
  updateItemQuantity(productId, newQuantity)
  {
    // loop through the cart and locate the matching product
    this.#cartItems.forEach((cartItem) =>
    {
      // update the item's quantity to the newQuantity
      if (cartItem.getProductId() === productId)
        cartItem.setQuantity(newQuantity);
    });

    // save the new cart to local storage
    this.saveToStorage();
  }

  /**
   * locates the item in the cart using the productId and changes the 
   * deliveryOptionId
   * 
   * @param {string} productId the ID associated with the item
   * @param {string} deliveryOptionId the ID associated with the delivery option
   */
  updateDeliveryOption(productId, deliveryOptionId)
  {
    // locate the item in the cart
    this.#cartItems.forEach((cartItem) =>
    {
      // change the deliveryOptionId
      if (productId === cartItem.getProductId())
        cartItem.setDeliveryOptionId(deliveryOptionId);
    });

    // save to local storage
    this.saveToStorage();
  }

  getCartItems()
  {
    return this.#cartItems;
  }

  getCartItem(productId)
  {
    return this.#cartItems.find((cartItem) =>
    {
      return cartItem.getProductId() === productId;
    });
  }

  /**
   * calculates the number of items in the cart
   * 
   * @returns {number} cartQuantity the number of items in the cart
   */
  getCartQuantity()
  {
    let quantity = 0;
    this.#cartItems.forEach((product) =>
    {
      quantity += product.getQuantity();
    });

    return quantity;
  }
}

class CartItem
{
  #productId;
  #quantity;
  #deliveryOptionId;

  constructor(productId, newQuantity)
  {
    this.#productId = productId;
    this.#quantity = newQuantity;
    this.#deliveryOptionId = '1'; // default to free shipping
  }

  setQuantity(newQuantity)
  {
    this.#quantity = newQuantity;
  }

  setDeliveryOptionId(newDeliveryOptionId)
  {
    this.#deliveryOptionId = newDeliveryOptionId;
  }

  getProductId()
  {
    return this.#productId;
  }

  getQuantity()
  {
    return this.#quantity;
  }

  getDeliveryOptionId()
  {
    return this.#deliveryOptionId;
  }

  toJSON()
  {
    return {
      productId: this.#productId,
      quantity: this.#quantity,
      deliveryOptionId: this.#deliveryOptionId
    };
  }
}

export let cart = new Cart('cart');

/**
 * creates a request and displays the response in the
 * 
 * @returns {Promise} text the response from the backend as a promise
 */
export async function loadCart()
{
  const response = await fetch('https://supersimplebackend.dev/cart');
  const text = await response.text();
  return text;
}

// export function loadCart(funct)
// {
//   const xhr = new XMLHttpRequest;

//   // when receiving the request, load the data into the products array
//   xhr.addEventListener('load', () =>
//   {
//     console.log(xhr.response);
//     // render the products grid
//     funct();
//   })


//   // create, setup, and send the request
//   xhr.open('GET', 'https://supersimplebackend.dev/cart');
//   xhr.send();
// }

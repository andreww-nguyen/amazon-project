class Cart
{
  cartItems;
  localStorageKey;

  constructor(localStorageKey)
  {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  /**
   * loads the cart from the memory in local storage
   */
  loadFromStorage()
  {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

    // initialize with default values if no values from local storage
    if (!this.cartItems)
    {
      this.cartItems = 
      [
        {
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryOptionId: '1'
        },
      
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionId: '2'
        }
      ];
    }
  }

  /**
   * saves the current cart to local storage
   */
  saveToStorage()
  {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
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
    this.cartItems.forEach((item) =>
    {
      if (productId === item.productId)
        matchingItem = item;
    });

    // increase the quantity of the item that is already in the cart
    if (matchingItem)
      matchingItem.quantity += productQuantity;

    // add the new product to the cart
    else
    {
      this.cartItems.push
      (
        {
          productId,
          quantity: productQuantity,
          deliveryOptionId: '1'
        }
      );
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
    const newCart = this.cartItems.filter(cartItem => cartItem.productId !== productId);

    // set our cart to newCart
    this.cartItems = newCart;

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
    this.cartItems.forEach((cartItem) =>
    {
      // update the item's quantity to the newQuantity
      if (cartItem.productId === productId)
        cartItem.quantity = newQuantity;
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
    this.cartItems.forEach((cartItem) =>
    {
      // change the deliveryOptionId
      if (productId === cartItem.productId)
        cartItem.deliveryOptionId = deliveryOptionId;
    });

    // save to local storage
    this.saveToStorage();
  }

  /**
   * calculates the number of items in the cart
   * 
   * @returns {number} cartQuantity the number of items in the cart
   */
  calculateCartQuantity()
  {
    // loop through the entire cart and add the quantities together
    let cartQuantity = 0;
    this.cartItems.forEach(cartItem => cartQuantity += cartItem.quantity);

    // return the quantity
    return cartQuantity;
  }
}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');



console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
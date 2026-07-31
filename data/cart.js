// retrieve cart from local storage
export let cart = JSON.parse(localStorage.getItem('cart'));

// initialize with default values if no values from local storage
if (!cart)
{
  cart = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2
    },
  
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1
    }
  ];
}

/**
 * uses the ID to add the new/existing item to the cart.
 * Adds the selected number of items that the user specified using the 
 * drop-down menu
 * 
 * @param {string} productId the ID associated with the product
 */
export function addToCart(productId)
{
  // get the number of items to add to the cart
  const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

  // check if the product already exists in the cart
  let matchingItem;
  cart.forEach((item) =>
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
    cart.push
    (
      {
        productId,
        quantity: productQuantity
      }
    );
  }

  saveToStorage();
}

/**
 * uses a product's ID to remove the item from the car
 * 
 * @param {string} productId the ID associated with the product
 */
export function removeFromCart(productId)
{
  // create a new array, but filter out the item with the same productId
  const newCart = cart.filter(cartItem => cartItem.productId !== productId);

  // set our cart to newCart
  cart = newCart;

  // save the cart to local storage
  saveToStorage();
}

/**
 * 
 * @returns {number} cartQuantity the number of items in the cart
 */
export function calculateCartQuantity()
{
  // loop through the entire cart and add the quantities together
  let cartQuantity = 0;
  cart.forEach(cartItem => cartQuantity += cartItem.quantity);

  // return the quantity
  return cartQuantity;
}

/**
 * loops through the cart and locates the item based on the ID.
 * Then, the item's quantity is changed to the newQuantity
 * 
 * @param {string} productId the ID associated with the product
 * @param {number} newQuantity the specified quantity the user wants to change to
 */
export function updateItemQuantity(productId, newQuantity)
{
  // loop through the cart and locate the matching product
  cart.forEach((cartItem) =>
  {
    // update the item's quantity to the newQuantity
    if (cartItem.productId === productId)
      cartItem.quantity = newQuantity;
  });

  // save the new cart to local storage
  saveToStorage();
}

/**
 * saves the current cart to local storage
 */
function saveToStorage()
{
  localStorage.setItem('cart', JSON.stringify(cart));
}
export const cart = [];

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
}
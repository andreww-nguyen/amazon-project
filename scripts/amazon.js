import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

// 
updateCartQuantity(); 

let productsHTML = '';
// loop through the array to get the product information
products.forEach((product) =>
{
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">

        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="js-added-${product.id} added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="js-add-to-cart add-to-cart-button button-primary"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// eventListener for the 'add to cart' buttons
document.querySelectorAll('.js-add-to-cart').forEach((button) =>
{
  // get the product ID
  const productId = button.dataset.productId
  let previousTimeoutID; // used for each unique previous timeoutID, if it exists
  
  // eventListener for the selected button
  button.addEventListener('click', () => 
  {
    // add the product to the cart
    addToCart(productId);

    // update the cart quantity
    updateCartQuantity();  

    // display the 'added' text on the page. Store the timeoutID generated
    // from setTimeout into currentTimeoutID.
    let currentTimeoutID = displayAddedText(productId, previousTimeoutID)

    // store the current timeout ID into previous timeoutID. The timeoutID of this click
    // will be the previous ID of the next click.
    previousTimeoutID = currentTimeoutID;
  });
});

/**
 * updates the cart quantity on the page. It calculates the number of items
 * in the cart and displays it
 */
function updateCartQuantity()
{
  // calculate the number of items in the cart
  let cartQuantity = 0;
  cart.forEach(cartItem => cartQuantity += cartItem.quantity);

  // updathe the cart quantity
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

/**
 * displays the 'added' text to the page. Then, uses setTimeout to 
 * hide the text after a specified delay.
 * 
 * @param {string} productId the ID associated with the item
 * @param {number} previousTimeoutID the ID associated with the previous timeout
 * @returns {number} tempTimeoutID the ID associated with the current timeout
 */
function displayAddedText(productId, previousTimeoutID)
{
  // display the added text
  document.querySelector(`.js-added-${productId}`).classList.add('displayed');

  // stop the previous timeout if it exists
  if (previousTimeoutID) 
    clearTimeout(previousTimeoutID);

  // store the timeout ID in a temporary variable
  let tempTimeoutID = setTimeout(() => 
  {
    document.querySelector(`.js-added-${productId}`).classList.remove('displayed');
  }, 2000);

  // return the ID so it is not lost when the code goes outside the scope of 
  // this function
  return tempTimeoutID;
}
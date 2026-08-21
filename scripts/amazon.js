import { cart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

/**
 * retrives the data from the backend for the products,
 * then updates the cart quantity and the products grid
 */
loadHomePage();

async function loadHomePage()
{
  await loadProducts();

  // update the cart quantity when loading the page
  updateCartQuantity();

  renderProductsGrid();
}

/**
 * renders the grid of the products and displays the HTML on the page
 */
function renderProductsGrid()
{
  let productsHTML = '';
  // loop through the array to get the product information
  products.forEach((product) =>
  {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.getImage()}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.getName()}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsURL()}">

          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.getId()}">
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

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="js-added-${product.getId()} added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="js-add-to-cart add-to-cart-button button-primary"
        data-product-id="${product.getId()}">
          Add to Cart
        </button>
      </div>`;
  });
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  console.log(products);

  // eventListener for the 'add to cart' buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button) =>
  {
    // get the product ID
    const productId = button.dataset.productId
    let previousTimeoutID; // used for each unique previous timeoutID, if it exists
    
    // eventListener for the selected button
    button.addEventListener('click', () => 
    {
      const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
      // add the product to the cart
      cart.addToCart(productId, quantity);

      // update the cart quantity
      updateCartQuantity();

      // display the 'added' text on the page. Store the timeoutID generated
      // from setTimeout into currentTimeoutID
      let currentTimeoutID = displayAddedText(productId, previousTimeoutID)

      // store the current timeout ID into previous timeoutID. The timeoutID of this click
      // will be the previous ID of the next click.
      previousTimeoutID = currentTimeoutID;
    });
  });
}

/**
 * updates the cart quantity on the page. It calculates the number of items
 * in the cart and displays it
 */
function updateCartQuantity()
{
  // update the cart quantity
  document.querySelector('.js-cart-quantity').innerHTML = cart.getCartQuantity();
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
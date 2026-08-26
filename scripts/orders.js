import { orders } from '../data/orders.js'
import { cart } from '../data/cart.js'
import { loadProducts, getProduct } from '../data/products.js'
import { formatCurrency } from '../scripts/utils/money.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// load the products first then generate the HTML
renderOrderSummary();

document.querySelector('.js-search-button').addEventListener('click', () =>
{
  const search = document.querySelector('.js-search-bar').value;

  // check if the user entered anythin in the text box
  if (search)
    document.querySelector('.js-search-link').href = `index.html?search=${search}`;
  else
    document.querySelector('.js-search-link').href = `index.html`;
});

document.body.addEventListener('keydown', (event) =>
{
  const search = document.querySelector('.js-search-bar').value;

  // only trigger if the search bar is the active element
  if ((event.key === 'Enter') && 
    document.activeElement === document.querySelector('.js-search-bar'))
  {
    // check if the user entered anythin in the text box
    if (search)
      window.location.href = `index.html?search=${search}`;
    else
      window.location.href = `index.html`;
  }
});

/**
 * loads the products and generates the HTML for the order summary page
 */
async function renderOrderSummary()
{
  // wait until the products finish loading
  await loadProducts();

  // change the cart label in the header
  document.querySelector('.js-cart-quantity').innerHTML = cart.getCartQuantity();

  // generate the order summary HTML
  let orderSummaryHTML = '';

  // loop through the orders
  orders.forEach((order) =>
  {
    orderSummaryHTML += 
    `
      <div class="js-order-container order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dayjs(order.orderTime).format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="js-order-details-grid-${order.id} order-details-grid"></div>
      </div>
    `;
  });

  // insert the HTML onto the page
  document.querySelector('.js-orders-grid').innerHTML = orderSummaryHTML;

  // generate the HTML for the products in the order
  renderOrderProductDetails();
}

/**
 * generates the HTML for the products in the order
 */
function renderOrderProductDetails()
{
  // loop through the orders
  orders.forEach((order) =>
  {
    let orderProductsHTML = '';

    // loop through the products in the order
    order.products.forEach((product) =>
    {
      const matchingProduct = getProduct(product.productId);
      const deliveryDate = product.estimatedDeliveryTime;

      orderProductsHTML += 
      `
        <div class="product-image-container">
          <img src="${matchingProduct.getImage()}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.getName()}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(deliveryDate).format('MMMM D')}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="js-buy-again buy-again-button button-primary"
          data-product-id="${product.productId}"
          data-order-id="${order.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    // insert the HTML into the website
    document.querySelector(`.js-order-details-grid-${order.id}`).innerHTML = orderProductsHTML;
  });

  // add event listeners for the 'Buy again' buttons
  document.querySelectorAll('.js-buy-again').forEach((button) =>
  {
    let previousTimeoutId;

    button.addEventListener('click', () =>
    {
      // get the productId
      const productId = button.dataset.productId;
      
      // add the item to the cart
      cart.addToCart(productId, 1);

      // update the cart quantity label in the header
      document.querySelector('.js-cart-quantity').innerHTML = cart.getCartQuantity();

      // display the 'added' text on the page. Store the timeoutID generated
      // from setTimeout into currentTimeoutID
      let currentTimeoutId = displayAddedText(previousTimeoutId, button);

      // store the current timeout ID into previous timeoutID. The timeoutID of this click
      // will be the previous ID of the next click.
      previousTimeoutId = currentTimeoutId;
    });
  });
}

function displayAddedText(previousTimeoutId, button)
{
  button.innerHTML = '&#10003; Added';

  // stop the previous timeout if it exists so we can restart the timer
  if (previousTimeoutId)
    clearTimeout(previousTimeoutId);

  // store the timeout ID generated by setTimeout in tempId
  let tempId = setTimeout(() =>
  {
    button.innerHTML = 
    `
      <img class="buy-again-icon" src="images/icons/buy-again.png">
      <span class="buy-again-message">Buy it again</span>
    `;
  }, 2000);

  // restore the timeout ID so it is not lost
  return tempId;
}
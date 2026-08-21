import { orders } from '../data/orders.js'
import { products, loadProducts, getProduct } from '../data/products.js'
import { formatCurrency } from '../scripts/utils/money.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// load the products first then generate the HTML
await load();
renderOrderSummary();

function renderOrderSummary()
{
  let orderSummaryHTML = '';
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

  renderOrderProductDetails();
  console.log(orders);
}

async function renderOrderProductDetails()
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
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=123&productId=456">
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
}

async function load()
{
  await loadProducts();
}
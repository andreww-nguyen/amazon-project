import { getProduct } from '../data/products.js';

const urlParam = new URLSearchParams(window.location.search);
const orderId = urlParam.get('orderId');
const productId = urlParam.get('productId');
console.log(orderId);

renderTrackingPage();

function renderTrackingPage()
{
  let productOrderHTML = 
  `
    <a class="back-to-orders-link link-primary" href="orders.html">
      <button class="back-to-orders-button button-primary">
        View all orders
      </button>
    </a>

    <div class="delivery-date">
      Arriving on Monday, June 13
    </div>

    <div class="product-info">
      Black and Gray Athletic Cotton Socks - 6 Pairs
    </div>

    <div class="product-info">
      Quantity: 1
    </div>

    <img class="product-image" src="images/products/athletic-cotton-socks-6-pairs.jpg">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;
  document.querySelector('.js-order-tracking').innerHTML = productOrderHTML;
}
import { getProduct } from '../data/products.js';

const urlParam = new URLSearchParams(window.location.search);
const orderId = urlParam.get('orderId');
const productId = urlParam.get('productId');
console.log(orderId);
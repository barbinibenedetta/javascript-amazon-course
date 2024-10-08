import {cart} from '../../data/cart-class.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  renderCheckoutHeader();

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
            </div>
            <div class="product-price js-product-price-${matchingProduct.id}">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}" data-product-id="${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id} js-quantity-input" data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option js-delivery-option-${deliveryOption.id}-${matchingProduct.id}" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input js-delivery-option-input-${deliveryOption.id}-${matchingProduct.id}"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);
      
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
    document.querySelector(`.js-cart-item-container-${productId}`).classList.add("is-editing-quantity");  
    });
  });

  function handleQuantityUpdate(productId) {
    let newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

    if (newQuantity <= 0) {
      alert('Error: product quantity cannot be less than 1');
      newQuantity = 1;
    }

    if (isNaN(newQuantity) || !newQuantity) {
      alert('Error: product quantity must be a number');
      newQuantity = 1;
    }
    
    if (newQuantity >= 1000) {
      let promptResult = "";

      while(!promptResult || isNaN(promptResult)) {
        promptResult = window.prompt("Hey! Looks like you are ordering many items! To make sure your purchase is not accidental, please type the desired product quantity once again.");
      }
      newQuantity = Number(promptResult);
    }
    
      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove("is-editing-quantity");

      cart.updateQuantity(productId, newQuantity);
    
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
    
      renderCheckoutHeader();
  }

  document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      handleQuantityUpdate(productId);
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(`.js-quantity-input`).forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const productId = input.dataset.productId;
        handleQuantityUpdate(productId);
        event.preventDefault();
        renderPaymentSummary();
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader();
}
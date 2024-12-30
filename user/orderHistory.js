import { fetchOrders } from "../app/order.js";

const ordersContainer = document.getElementById("orders-container");

async function loadOrders() {
  try {
    const orders = await fetchOrders();
    if (orders.length === 0) {
      ordersContainer.innerHTML = `<p>주문 내역이 없습니다.</p>`;
      return;
    }

    ordersContainer.innerHTML = orders
      .map((order) => {
        const orderDate = new Date(order.created_at).toLocaleDateString();
        const itemsHtml = order.items
          .map(
            (item) => `
          <div class="order-item">
            <img src="${item.images[0]}" alt="${
              item.name
            }" class="order-item-image" />
            <div class="order-item-details">
              <span class="item-name">${item.name}</span>
              <span class="item-quantity">수량: ${item.quantity}</span>
              <span class="item-price">${item.price.toLocaleString()}원</span>
            </div>
          </div>`
          )
          .join("");

        return `
        <div class="order-card">
          <h3>주문 번호: ${order.order_id}</h3>
          <p>주문 날짜: ${orderDate}</p>
          <p>총 금액: ${order.total_price.toLocaleString()}원</p>
          <div class="order-items">
            ${itemsHtml}
          </div>
        </div>`;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load orders:", error.message);
    ordersContainer.innerHTML = `<p>주문 내역을 불러오는 데 실패했습니다.</p>`;
  }
}

loadOrders();

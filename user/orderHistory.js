import { getUserProfile } from "../services/userService.js";
import { getUserOrders } from "../services/orderService.js";
import { formatImagePath } from "../components/utils/image.js";

// DOM 요소 가져오기
const ordersContainer = document.querySelector(".orders-container");

// 주문내역 렌더링 함수
async function renderOrders() {
  try {
    const user = await getUserProfile();
    if (!user) {
      alert("로그인이 필요합니다.");
      window.location.href = "/user/login.html";
      return;
    }

    const orders = await getUserOrders(user.user_id);
    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = "<p>주문 내역이 없습니다.</p>";
      return;
    }

    ordersContainer.innerHTML = ""; // 기존 내용 초기화

    for (const order of orders) {
      const orderHTML = `
        <div class="order">
          <div class="order-header">
            <span>주문번호: ${order.order_id}</span>
            <span>주문일자: ${new Date(
              order.created_at
            ).toLocaleDateString()}</span>
            <span>상태: ${order.order_status}</span>
          </div>
          <div class="order-items">
            ${order.order_items
              .map((item) => {
                const formattedImage = item.products.images?.[0]
                  ? formatImagePath(item.products.images[0])
                  : "default-image.jpg";

                return `
                  <div class="order-item">
                    <img src="${formattedImage}" alt="${
                  item.products.name || "상품 이미지"
                }" />
                    <div class="item-info">
                      <span>${item.products.name || "상품명 없음"}</span>
                      <span>수량: ${item.quantity}</span>
                      <span>옵션: ${formatOptions(item.options)}</span>
                      <span>금액: ${(
                        item.price * item.quantity
                      ).toLocaleString()} 원</span>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
          <div class="order-footer">
            <span>총 금액: ${order.total_amount.toLocaleString()} 원</span>
          </div>
        </div>
      `;

      ordersContainer.insertAdjacentHTML("beforeend", orderHTML);
    }
  } catch (error) {
    console.error("주문 내역 렌더링 오류:", error);
    alert("주문 내역을 불러오는 중 문제가 발생했습니다.");
  }
}

// 옵션 데이터 포맷 함수
function formatOptions(options) {
  if (!options) return "없음";

  try {
    const parsedOptions =
      typeof options === "string" ? JSON.parse(options) : options;

    if (parsedOptions.options) {
      return Object.values(parsedOptions.options)
        .map((opt) => opt.value)
        .join(", ");
    }

    return "없음";
  } catch (error) {
    console.error("옵션 데이터 포맷 오류:", error);
    return "잘못된 옵션 데이터";
  }
}

// 초기 렌더링
renderOrders();

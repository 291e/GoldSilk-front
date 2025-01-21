import { getUserProfile } from "../services/userService.js";
import { getUserOrders } from "../services/orderService.js";
import { formatImagePath } from "../components/utils/image.js";

// DOM 요소 가져오기
const ordersContainer = document.querySelector(".orders-container");
const paginationContainer = document.querySelector(".pagination-container");

let currentPage = 1;
const itemsPerPage = 10;
// 주문내역 렌더링 함수
async function renderOrders(page = 1) {
  try {
    const user = await getUserProfile();
    if (!user) {
      alert("로그인이 필요합니다.");
      window.location.href = "/user/login.html";
      return;
    }

    const { orders, totalPages } = await getUserOrders(page, itemsPerPage);

    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = "<p>주문 내역이 없습니다.</p>";
      paginationContainer.innerHTML = "";
      return;
    }

    ordersContainer.innerHTML = ""; // 기존 내용 초기화

    for (const order of orders) {
      const orderItemsHTML = await Promise.all(
        order.order_items.map(async (item) => {
          const formattedImage = item.products.images?.[0]
            ? await formatImagePath(item.products.images[0]) // 이미지 경로 처리
            : "default-image.jpg";

          return `
            <div class="order-item">
              <img src="${formattedImage}" alt="${
            item.products.name || "상품 이미지"
          }" />
              <div class="item-info">
                <span>${item.products.name || "상품명 없음"}</span>
                <span>${item.quantity}개</span>
                <span>옵션: ${formatOptions(item.options)}</span>
                <span>${(item.price * item.quantity).toLocaleString()} 원</span>
              </div>
            </div>
          `;
        })
      );

      const orderHTML = `
        <div class="order">
          <div class="order-header">
            <span id="created-order">${new Date(
              order.created_at
            ).toLocaleDateString()}</span>
            <span>상태: ${order.order_status}</span>
          </div>
          <div class="order-items">
            ${orderItemsHTML.join("")}
          </div>
          <div class="order-footer">
            <span>총 금액: ${order.total_amount.toLocaleString()} 원</span>
          </div>
        </div>
      `;

      ordersContainer.insertAdjacentHTML("beforeend", orderHTML);
    }

    // 페이지네이션 렌더링 호출
    renderPagination(totalPages);
  } catch (error) {
    console.error("주문 내역 렌더링 오류:", error);
    alert("주문 내역을 불러오는 중 문제가 발생했습니다.");
  }
}
function renderPagination(totalPages) {
  paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화

  if (totalPages <= 1) return;

  // 처음으로 이동
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<button class="pagination-btn" data-page="1"><<</button>`
  );

  // 이전 페이지
  if (currentPage > 1) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-btn" data-page="${currentPage - 1}"><</button>`
    );
  }

  // 페이지 번호 버튼
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`
    );
  }

  // 다음 페이지
  if (currentPage < totalPages) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-btn" data-page="${currentPage + 1}">></button>`
    );
  }

  // 마지막으로 이동
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<button class="pagination-btn" data-page="${totalPages}">>></button>`
  );

  addPaginationListeners();
}

// 페이지네이션 이벤트 리스너 추가
function addPaginationListeners() {
  const buttons = paginationContainer.querySelectorAll(".pagination-btn");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
      const targetPage = parseInt(e.target.dataset.page, 10);
      if (!isNaN(targetPage) && targetPage !== currentPage) {
        currentPage = targetPage;
        renderOrders(currentPage);
      }
    })
  );
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
renderOrders(currentPage);

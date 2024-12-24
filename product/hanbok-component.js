import { fetchProducts } from "../api/api.js"; // JSON 데이터를 가져오는 API 함수
import { formatImagePath } from "../components/utils/image.js";

class HanbokComponent extends HTMLElement {
  constructor() {
    super();
    this.products = [];
    this.category = ""; // 카테고리 변수
    this.title = ""; // 제목 변수
    this.currentPage = 1; // 현재 페이지
    this.itemsPerPage = 15; // 페이지당 항목 수
  }

  async connectedCallback() {
    // 현재 카테고리 가져오기 (HTML 속성에서 추출)
    this.category = this.getAttribute("data-category") || "혼주";
    this.title = this.getAttribute("data-title") || `${this.category} 한복`;

    try {
      // 데이터 가져오기
      const allProducts = await fetchProducts();

      // 변경된 API 구조에 맞춰 카테고리 필터링
      this.products = allProducts.filter(
        (product) =>
          product.category?.trim().toLowerCase() ===
          this.category.trim().toLowerCase()
      );

      await this.render(); // 렌더링 (비동기 이미지 처리)
      this.addEventListeners();
    } catch (error) {
      console.error("Failed to load products:", error);
      this.innerHTML = `<p>상품 데이터를 불러오는 데 실패했습니다.</p>`;
    }
  }

  async render() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const paginatedProducts = this.products.slice(start, end);

    this.innerHTML = `
      <div class="hanbok-container">
        <!-- 제목 -->
        <div class="hanbok-header">
          <h1 class="hanbok-title">${this.title}</h1>
          <div class="hanbok-controls">
            <span class="product-count">등록 제품: ${
              this.products.length
            }개</span>
            <div class="filter">
              <select id="filter-select">
                <option value="new">신상품</option>
                <option value="name">상품명</option>
                <option value="low-price">낮은 가격</option>
                <option value="high-price">높은 가격</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 분리선 -->
        <hr class="divider" />

        <!-- 상품 리스트 -->
        <div class="product-grid">
          ${await this.renderProducts(paginatedProducts)}
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination-hanbok">
          ${this.renderPagination()}
        </div>
      </div>
    `;

    this.addEventListeners(); // 렌더링 후 이벤트 리스너 추가
  }

  async renderProducts(products) {
    if (products.length === 0) {
      return `<p>등록된 제품이 없습니다.</p>`;
    }

    // 비동기적으로 이미지 경로 처리
    const renderedProducts = await Promise.all(
      products.map(async (product) => {
        const imagePath = await formatImagePath(product.images?.[0]);
        return `
          <div class="product-card" data-id="${product.product_id}">
            <div class="product-image-wrapper">
              <img src="${imagePath}" alt="${
          product.name || "상품 이미지"
        }" class="product-image" />
              <div class="hover-icons">
                <i class="fa fa-heart wish-icon"></i>
                <i class="fa-solid fa-cart-plus cart-icon" data-id="${
                  product.product_id
                }"></i>
              </div>
            </div>
            <div class="product-info">
              <span class="product-name">${product.name}</span>
              <span class="product-price">${product.price.toLocaleString()} 원</span>
            </div>
          </div>
        `;
      })
    );

    return renderedProducts.join("");
  }

  renderPagination() {
    const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
      buttons += `
        <button class="pagination-btn ${
          i === this.currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>
      `;
    }

    return `
      <button class="pagination-btn" data-page="first"><<</button>
      <button class="pagination-btn" data-page="prev"><</button>
      ${buttons}
      <button class="pagination-btn" data-page="next">></button>
      <button class="pagination-btn" data-page="last">>></button>
    `;
  }

  addEventListeners() {
    // 필터 이벤트
    const filterSelect = this.querySelector("#filter-select");
    filterSelect.addEventListener("change", (e) => {
      const filterValue = e.target.value;
      this.applyFilter(filterValue);
    });

    // 페이지네이션 이벤트
    const paginationButtons = this.querySelectorAll(".pagination-btn");
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.target.dataset.page;
        this.handlePagination(action);
      });
    });

    // 상품 클릭 이벤트
    const productCards = this.querySelectorAll(".product-card");
    productCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const productId = this.products[start + index].product_id;
        window.location.href = `product.html?product_id=${productId}`;
      });
    });
  }

  handlePagination(action) {
    const totalPages = Math.ceil(this.products.length / this.itemsPerPage);

    switch (action) {
      case "first":
        this.currentPage = 1;
        break;
      case "prev":
        if (this.currentPage > 1) this.currentPage--;
        break;
      case "next":
        if (this.currentPage < totalPages) this.currentPage++;
        break;
      case "last":
        this.currentPage = totalPages;
        break;
      default:
        this.currentPage = parseInt(action, 10);
    }

    this.render();
  }

  applyFilter(filter) {
    switch (filter) {
      case "new":
        this.products.sort((a, b) => b.product_id - a.product_id); // 신상품 순
        break;
      case "name":
        this.products.sort((a, b) => a.name.localeCompare(b.name)); // 이름 순
        break;
      case "low-price":
        this.products.sort((a, b) => a.price - b.price); // 낮은 가격 순
        break;
      case "high-price":
        this.products.sort((a, b) => b.price - a.price); // 높은 가격 순
        break;
    }
    this.currentPage = 1; // 필터 적용 시 첫 페이지로 이동
    this.render();
  }
}

customElements.define("hanbok-component", HanbokComponent);

export default HanbokComponent;

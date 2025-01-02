import { fetchProducts, addToCart } from "../app/api.js"; // JSON 데이터를 가져오는 API 함수
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
    this.category = this.getAttribute("data-category") || "혼주";
    this.title = this.getAttribute("data-title") || `${this.category} 한복`;

    try {
      const allProducts = await fetchProducts();
      this.products = allProducts.filter(
        (product) =>
          product.category?.trim().toLowerCase() ===
          this.category.trim().toLowerCase()
      );

      await this.render();
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

        <hr class="divider" />

        <div class="product-grid">
          ${await this.renderProducts(paginatedProducts)}
        </div>

        <div class="pagination-hanbok">
          ${this.renderPagination()}
        </div>
      </div>
    `;

    this.addEventListeners();
  }

  async renderProducts(products) {
    if (products.length === 0) {
      return `<p>등록된 제품이 없습니다.</p>`;
    }

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
    const filterSelect = this.querySelector("#filter-select");
    filterSelect.addEventListener("change", (e) => {
      const filterValue = e.target.value;
      this.applyFilter(filterValue);
    });

    const paginationButtons = this.querySelectorAll(".pagination-btn");
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.target.dataset.page;
        this.handlePagination(action);
      });
    });

    const cartIcons = this.querySelectorAll(".cart-icon");
    cartIcons.forEach((cartIcon) => {
      cartIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const productId = e.currentTarget.dataset.id;

        if (!productId) {
          alert("상품 정보를 찾을 수 없습니다.");
          return;
        }

        try {
          await addToCart(productId, 1);
          alert("장바구니에 상품이 추가되었습니다!");
        } catch (error) {
          console.error("Error adding to cart:", error.message);
          alert("장바구니 추가 중 오류가 발생했습니다.");
        }
      });
    });

    const productCards = this.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.id;
        if (productId) {
          window.location.href = `/product.html?product_id=${productId}`;
        }
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
        this.products.sort((a, b) => b.product_id - a.product_id);
        break;
      case "name":
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "low-price":
        this.products.sort((a, b) => a.price - b.price);
        break;
      case "high-price":
        this.products.sort((a, b) => b.price - a.price);
        break;
    }
    this.currentPage = 1;
    this.render();
  }
}

customElements.define("hanbok-component", HanbokComponent);

export default HanbokComponent;

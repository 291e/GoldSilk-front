import { fetchProducts, addToCart } from "../../app/api.js"; // JSON 데이터를 가져오는 API 함수
import { formatImagePath } from "../utils/image.js";

class NewProductComponent extends HTMLElement {
  constructor() {
    super();
    this.products = [];
  }

  async connectedCallback() {
    try {
      // 데이터 가져오기
      const allProducts = await fetchProducts();

      // "NEW" 태그 필터링
      this.products = allProducts
        .filter(
          (product) =>
            Array.isArray(product.tags) && product.tags.includes("NEW")
        )
        .slice(0, 10); // 최신 10개 상품만 가져오기

      await this.render(); // 비동기 렌더링
      this.addEventListeners();
    } catch (error) {
      console.error("Failed to load new products:", error);
      this.innerHTML = `<p>신상품 데이터를 불러오는 데 실패했습니다.</p>`;
    }
  }

  // 비동기 렌더링 함수
  async render() {
    this.innerHTML = `
      <div class="new-product-container">
        <!-- 제목 -->
        <div class="swiper-text">
          <span>신상품</span>
          <span>황금단에서 선보이는 신상품</span>
        </div>
        
        <!-- 상품 리스트 -->
        <div class="Products">
          ${await this.renderProducts()}
        </div>
      </div>
    `;
  }

  // 신상품 리스트 렌더링 (비동기 이미지 처리)
  async renderProducts() {
    if (this.products.length === 0) {
      return `<p>등록된 신상품이 없습니다.</p>`;
    }

    const renderedProducts = await Promise.all(
      this.products.map(async (product) => {
        const imagePath = await formatImagePath(product.images?.[0]);

        return `
          <div class="product-card" data-id="${product.product_id || "N/A"}">
            <div class="product-image-wrapper">
              <img src="${imagePath}" alt="${
          product.name || "상품 이미지"
        }" class="product-image" />
              <div class="hover-icons">
                <i class="fa-solid fa-cart-plus cart-icon" data-id="${
                  product.product_id
                }"></i>
              </div>
            </div>
            
            <div class="product-info">
              <span class="product-name">${
                product.name || "상품명 없음"
              }</span>          
              <span class="price">${
                product.price
                  ? product.price.toLocaleString() + " 원"
                  : "가격 정보 없음"
              }</span>
              ${
                product.tags?.includes("NEW")
                  ? `<span class="newTag">NEW</span>`
                  : ""
              }
            </div>
          </div>
        `;
      })
    );

    return renderedProducts.join("");
  }

  // 이벤트 추가
  addEventListeners() {
    // 상품 카드 클릭 이벤트
    const productElements = this.querySelectorAll(".product-card");
    productElements.forEach((productElement) => {
      productElement.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.id;
        if (productId) {
          window.location.href = `product.html?product_id=${productId}`;
        }
      });
    });

    // 장바구니 아이콘 클릭 이벤트
    const cartIcons = this.querySelectorAll(".cart-icon");
    cartIcons.forEach((cartIcon) => {
      cartIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
        const productId = e.currentTarget.dataset.id;

        if (!productId || productId === "N/A") {
          alert("유효하지 않은 상품입니다.");
          return;
        }

        try {
          await addToCart(productId, 1); // API 호출로 장바구니에 추가
          alert("장바구니에 상품이 추가되었습니다!");
        } catch (error) {
          console.error("Error adding to cart:", error.message);
          alert("장바구니 추가에 실패했습니다.");
        }
      });
    });
  }
}

customElements.define("new-product-component", NewProductComponent);

export default NewProductComponent;

import { getAllProducts } from "../../services/productService.js";
import { addCartItem } from "../../services/cartService.js";
import { formatImagePath } from "../utils/image.js";

class BestProductComponent extends HTMLElement {
  constructor() {
    super();
    this.products = [];
  }

  async connectedCallback() {
    try {
      // 데이터 가져오기
      const allProducts = await getAllProducts();

      // "BEST" 태그 필터링
      this.products = allProducts
        .filter(
          (product) =>
            Array.isArray(product.tags) && product.tags.includes("BEST")
        )
        .slice(0, 10); // 최대 10개 상품만 가져오기

      await this.render(); // 비동기 렌더링
      this.addEventListeners();
    } catch (error) {
      console.error("Failed to load best products:", error);
      this.innerHTML = `<p>베스트셀러 데이터를 불러오는 데 실패했습니다.</p>`;
    }
  }

  // 렌더링 함수
  async render() {
    this.innerHTML = `
      <div class="best-product-container">
        <!-- 제목 -->
        <div class="swiper-text">
          <span>베스트셀러</span>
          <span>황금단에서 인기있는 상품</span>
        </div>
        
        <!-- 상품 리스트 -->
        <div class="Products">
          ${await this.renderProducts()}
        </div>
      </div>
    `;
  }

  // 베스트셀러 상품 렌더링
  async renderProducts() {
    if (this.products.length === 0) {
      return `<p>등록된 베스트셀러 상품이 없습니다.</p>`;
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
                product.tags?.includes("BEST")
                  ? `<span class="bestTag">BEST</span>`
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
    const bestProductElements = this.querySelectorAll(".product-card");
    bestProductElements.forEach((productElement) => {
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
        e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 방지
        const productId = e.currentTarget.dataset.id;

        if (!productId || productId === "N/A") {
          alert("유효하지 않은 상품입니다.");
          return;
        }

        try {
          await addCartItem(productId, 1); // 최신 API 호출로 장바구니에 추가
          alert("장바구니에 상품이 추가되었습니다!");
        } catch (error) {
          console.error("Error adding to cart:", error.message);
          alert("장바구니 추가에 실패했습니다.");
        }
      });
    });
  }
}

customElements.define("best-product-component", BestProductComponent);

export default BestProductComponent;

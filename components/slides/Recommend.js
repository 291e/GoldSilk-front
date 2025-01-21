import { getAllProducts } from "../../services/productService.js";
import { addCartItem } from "../../services/cartService.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../services/wishlistService.js";
import { updateProduct } from "../../services/adminService.js";
import { formatImagePath } from "../utils/image.js";

class RecommendComponent extends HTMLElement {
  async connectedCallback() {
    this.isAdmin = this.checkAdminStatus();
    this.editMode = false;

    try {
      const allProducts = await getAllProducts();

      // "BEST" 태그를 가진 상품만 필터링
      this.products = allProducts
        .filter(
          (product) =>
            Array.isArray(product.tags) &&
            (product.tags.includes("BEST") || product.tags.includes("NEW"))
        )
        .sort((a, b) => b.product_id - a.product_id) // product_id 역순 정렬
        .slice(0, 10); // 최대 10개만 표시

      if (this.products.length === 0) {
        this.innerHTML = `<p>추천할 상품이 없습니다.</p>`;
        return;
      }

      await this.renderProducts(this.products);

      new Swiper(".swiper", {
        slidesPerView: 5,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });

      this.addEventListeners();
    } catch (error) {
      console.error("Failed to load recommended products:", error);
      this.innerHTML = `<p>추천 상품 데이터를 불러오는 데 실패했습니다.</p>`;
    }
  }

  checkAdminStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.is_admin === true;
  }

  async renderProducts(products) {
    const renderedProducts = await Promise.all(
      products.map(async (product) => {
        const imagePath = await formatImagePath(product.images?.[0]);
        const wishlistCount = product.wishlist_count || 0;

        return `
          <div class="swiper-slide" >
            <div class="product" data-id="${product.product_id}">
              <div class="product-image-wrapper">
                <img src="${imagePath}" alt="${
          product.name || "상품 이미지"
        }" class="product-image">
                <div class="product-overlay">
                  <div class="product-info">
                    <span>${product.name || "상품명 없음"}</span>
                    <span class="price">${
                      product.price
                        ? product.price.toLocaleString() + " 원"
                        : "가격 정보 없음"
                    }</span>
                    <div class="tagBox">
                      ${
                        product.tags
                          ?.map(
                            (tag) =>
                              `<span class="${
                                tag === "NEW" ? "newTag" : "bestTag"
                              }">${tag}</span>`
                          )
                          .join("") || ""
                      }
                    </div>
                    <div class="hover-icons" style="opacity: 1;">
                      <i class="fa-regular fa-heart wishlist-icon" data-id="${
                        product.product_id
                      }">
                        <span class="wishlist-count">${wishlistCount}</span>
                      </i>
                      <i class="fa-solid fa-cart-plus cart-icon" data-id="${
                        product.product_id
                      }"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })
    );

    this.innerHTML = `
      <div class="swiper">
        ${this.isAdmin ? '<i class="fa-solid fa-gear admin-gear"></i>' : ""}
        <div class="swiper-text">
          <span>추천상품</span>
          <span>황금단이 추천하는 상품</span>
        </div>
        <div class="swiper-wrapper">
          ${renderedProducts.join("")}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
    `;
  }

  addEventListeners() {
    this.querySelectorAll(".product").forEach((productElement) => {
      productElement.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.id;
        console.log("Clicked Product ID:", productId);
        if (productId && productId !== "N/A") {
          window.location.href = `./product.html?product_id=${productId}`;
        } else {
          alert("유효하지 않은 상품입니다.");
        }
      });
    });

    // 장바구니 추가 이벤트
    this.querySelectorAll(".cart-icon").forEach((cartIcon) => {
      cartIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const productId = e.currentTarget.dataset.id;

        try {
          await addCartItem(productId, 1); // 기본 수량 1
          cartIcon.classList.remove("fa-cart-plus");
          cartIcon.classList.add("fa-cart-shopping", "active");
          alert("장바구니에 추가되었습니다.");

          // 장바구니 업데이트 이벤트 발행
          const event = new CustomEvent("cartUpdated", {
            detail: { addedProductId: productId },
          });
          window.dispatchEvent(event); // 전역으로 이벤트 발행
        } catch (error) {
          alert("장바구니 추가 실패: " + error);
        }
      });
    });

    // 찜 목록 추가/삭제 이벤트
    this.querySelectorAll(".wishlist-icon").forEach((wishlistIcon) => {
      wishlistIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const productId = e.currentTarget.dataset.id;

        if (wishlistIcon.classList.contains("active")) {
          try {
            await removeFromWishlist(productId);
            wishlistIcon.classList.remove("fa-solid", "active");
            wishlistIcon.classList.add("fa-regular");
            wishlistIcon.querySelector(".wishlist-count").textContent =
              parseInt(
                wishlistIcon.querySelector(".wishlist-count").textContent
              ) - 1;
            alert("찜 목록에서 제거되었습니다.");
          } catch (error) {
            alert("찜 목록 제거 실패: " + error.message);
          }
        } else {
          try {
            await addToWishlist(productId);
            wishlistIcon.classList.remove("fa-regular");
            wishlistIcon.classList.add("fa-solid", "active");
            wishlistIcon.querySelector(".wishlist-count").textContent =
              parseInt(
                wishlistIcon.querySelector(".wishlist-count").textContent
              ) + 1;
            alert("찜 목록에 추가되었습니다.");
          } catch (error) {
            alert("찜 목록 추가 실패: " + error.message);
          }
        }
      });
    });

    // 어드민 기어 클릭 이벤트
    if (this.isAdmin) {
      this.querySelector(".admin-gear").addEventListener("click", () => {
        this.toggleEditMode();
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    alert(
      this.editMode
        ? "편집 모드가 활성화되었습니다."
        : "편집 모드가 비활성화되었습니다."
    );
    if (this.editMode) {
      this.enableEditModeUI();
    } else {
      this.disableEditModeUI();
    }
  }

  enableEditModeUI() {
    this.querySelectorAll(".swiper-slide").forEach((slide) => {
      const productId = slide.dataset.id;
      slide.innerHTML += `
        <div class="edit-mode-ui">
          <input type="text" value="${productId}" class="edit-product-id" />
          <button class="save-product-id">저장</button>
        </div>
      `;
      slide
        .querySelector(".save-product-id")
        .addEventListener("click", async () => {
          const newProductId = slide.querySelector(".edit-product-id").value;
          try {
            await updateProduct(productId, { product_id: newProductId });
            alert("상품 ID가 업데이트되었습니다.");
          } catch (error) {
            alert("상품 업데이트 실패: " + error.message);
          }
        });
    });
  }

  disableEditModeUI() {
    this.querySelectorAll(".edit-mode-ui").forEach((ui) => ui.remove());
  }
}

// 컴포넌트 정의
customElements.define("recommend-component", RecommendComponent);

export default RecommendComponent;

import { getReviewsByProduct } from "../../services/reviewService.js";
import { formatImagePath } from "../utils/image.js";

class ReviewComponent extends HTMLElement {
  constructor() {
    super();
    this.productId = null; // 연결된 상품 ID
    this.reviews = [];
  }

  async connectedCallback() {
    this.productId = this.getAttribute("data-product-id");
    if (!this.productId) {
      this.innerHTML = `<p>상품 ID가 필요합니다.</p>`;
      return;
    }

    try {
      if (this.productId === "all") {
        // 모든 리뷰 가져오기
        const response = await fetch("https://goldsilk.net/reviews");
        if (!response.ok) throw new Error("Failed to fetch all reviews.");
        this.reviews = await response.json();
      } else {
        // 특정 상품의 리뷰 가져오기
        this.reviews = await getReviewsByProduct(this.productId);
      }

      // 이미지 경로 포맷 적용
      this.reviews = await Promise.all(
        this.reviews.map(async (review) => ({
          ...review,
          image_url: review.image_url
            ? await formatImagePath(`review/${review.image_url}`)
            : "/assets/images/default-review.jpg",
        }))
      );

      await this.render();
    } catch (error) {
      console.error("리뷰를 불러오는 중 오류가 발생했습니다:", error);
      this.innerHTML = `<p>리뷰를 불러오는 데 실패했습니다.</p>`;
    }
  }

  async render() {
    this.innerHTML = `
      <div class="review-slider">
        <div class="review-list swiper-wrapper">
          ${
            this.reviews.length > 0
              ? this.reviews
                  .map(
                    (review) => `
                  <div class="swiper-slide review-item">
                    <img
                      src="${review.image_url}"
                      alt="Review Image"
                      class="review-image"
                    />
                    <h3 class="review-title">${review.title}</h3>
                    <div class="review-rating">${this.renderStars(
                      review.rating
                    )}</div>
                    <p class="review-comment">
                      ${this.truncateComment(review.comment, 50)}
                    </p>
                  </div>
                `
                  )
                  .join("")
              : `<p>리뷰가 없습니다.</p>`
          }
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    `;

    this.initializeSlider();
  }

  initializeSlider() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper is not defined. Please include Swiper JS.");
      return;
    }

    new Swiper(".review-slider", {
      slidesPerView: 3,
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
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  }

  renderStars(rating) {
    return Array.from({ length: 5 }, (_, index) => {
      return index < rating
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }).join("");
  }

  truncateComment(comment, length) {
    return comment.length > length ? comment.slice(0, length) + "..." : comment;
  }
}

customElements.define("review-component", ReviewComponent);
export default ReviewComponent;

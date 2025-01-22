import { getAllReviews } from "../../services/reviewService.js";
import { formatImagePath } from "../utils/image.js";

async function fetchAllReviews() {
  try {
    const reviews = await getAllReviews();

    const container = document.getElementById("reviews-container");

    // 최대 5개의 리뷰만 표시
    const limitedReviews = reviews.slice(0, 5);

    const reviewItems = await Promise.all(
      limitedReviews.map(async (review) => {
        const formattedImage = review.image_url
          ? await formatImagePath(`review/${review.image_url}`)
          : "/path/to/default-image.jpg";

        return `
        
          <div class="swiper-slide review-item">
         
            <img src="${formattedImage}" alt="Review Image" class="review-image" />
            <h3 class="review-title">${review.title}</h3>
            <div class="review-rating">
              ${renderStars(review.rating)}
            </div>
            <p class="review-comment">
              ${truncateComment(review.comment, 50)}
            </p>
            <span class="review-author">작성자: ${review.author}</span>
          </div>
        `;
      })
    );

    container.innerHTML = `
      <div class="review-slider">
        <div class="swiper-wrapper">
          ${reviewItems.join("")}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    `;

    initializeSwiper();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    container.innerHTML = `<p>리뷰를 불러오는 데 실패했습니다.</p>`;
  }
}

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => {
    return index < rating
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
  }).join("");
}

function truncateComment(comment, length) {
  return comment.length > length ? comment.slice(0, length) + "..." : comment;
}

function initializeSwiper() {
  new Swiper(".review-slider", {
    slidesPerView: 3, // 한 번에 표시할 슬라이드 개수
    spaceBetween: 20, // 슬라이드 간격
    loop: true, // 무한 루프
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 5000, // 자동 슬라이드 전환 시간 (ms)
      disableOnInteraction: false, // 사용자 상호작용 후에도 자동 슬라이드 유지
    },
  });
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", fetchAllReviews);

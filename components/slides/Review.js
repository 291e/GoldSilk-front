class ReviewSliderComponent extends HTMLElement {
  connectedCallback() {
    // 후기 데이터
    const reviews = [
      {
        id: 1,
        image: "public/product/product01.jpg",
        title: "Excellent Service",
        content:
          "The service was fantastic, and the quality of the product exceeded my expectations!",
        name: "John Doe",
        stars: 5,
      },
      {
        id: 2,
        image: "public/product/product02.jpg",
        title: "Amazing Experience",
        content:
          "I highly recommend this to anyone looking for great service and support.",
        name: "Jane Smith",
        stars: 5,
      },
      {
        id: 3,
        image: "public/product/product03.jpg",
        title: "Very Satisfied",
        content:
          "Absolutely loved it! The team was helpful, and the product is top-notch.",
        name: "Emily Johnson",
        stars: 5,
      },
      {
        id: 4,
        image: "public/product/product04.jpg",
        title: "Highly Recommend",
        content:
          "Great service, amazing products! Will definitely come back again.",
        name: "Michael Brown",
        stars: 5,
      },
      // 필요한 경우 더 많은 리뷰 추가
    ];

    // 최신 10개 리뷰만 가져오기
    const limitedReviews = reviews.slice(0, 10);

    // HTML 구조 생성
    this.innerHTML = `
      <div class="swiper-text">
        <span>고객후기</span>
        <span>상품을 이용하신 고객님들의 리얼 후기입니다!</span>
      </div>
      <div class="swiper review-slider">
        <div class="swiper-wrapper">
          ${limitedReviews
            .map(
              (review) => `
            <div class="swiper-slide review">
              <div class="review-image-wrapper">
                <img src="${review.image || "public/default-image.jpg"}" alt="${
                review.name || "고객님"
              }" class="review-image" />
              </div>
              <div class="review-text">
                <span class="review-title">${review.title || "제목 없음"}</span>
                <span class="review-content">${
                  review.content || "후기 내용이 없습니다."
                }</span>
                <span class="review-name">${review.name || "익명의 고객"}</span>
              </div>
              <div class="review-name-line"></div>
              <div class="review-stars">
                ${"★".repeat(review.stars || 0)}${"☆".repeat(
                5 - (review.stars || 0)
              )}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <!-- 네비게이션 버튼 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;

    // Swiper 초기화
    new Swiper(".review-slider", {
      slidesPerView: 3, // 한 화면에 보이는 슬라이드 수
      spaceBetween: 20, // 슬라이드 간 간격
      loop: true, // 무한 루프
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 4000, // 4초 간격으로 슬라이드 전환
        disableOnInteraction: false,
      },
    });
  }
}

// 컴포넌트 등록
if (!customElements.get("review-slider-component")) {
  customElements.define("review-slider-component", ReviewSliderComponent);
}

export default ReviewSliderComponent;

class AdBannerComponent extends HTMLElement {
  connectedCallback() {
    // 광고 배너 데이터
    const banners = [
      "한복을 디자인하는 전문기업",
      "전통과 현대의 조화를 이루는 한복 전문 쇼핑몰",
    ];

    // HTML 구조 생성
    this.innerHTML = `
        <div class="ad-banner-container">
          <button class="ad-banner-close" aria-label="닫기 버튼">×</button>
          <div class="swiper ad-banner-swiper">
            <div class="swiper-wrapper">
              ${banners
                .map(
                  (text) => `
                <div class="swiper-slide ad-banner-slide">
                  ${text}
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

    // Swiper 초기화
    const swiper = new Swiper(".ad-banner-swiper", {
      direction: "vertical", // 세로 방향
      loop: true, // 무한 루프
      autoplay: {
        delay: 3000, // 3초마다 자동 슬라이드
        disableOnInteraction: false, // 사용자가 조작해도 autoplay 유지
      },
      mousewheel: true, // 마우스 휠로 슬라이드 제어
    });

    // 닫기 버튼 이벤트
    const closeButton = this.querySelector(".ad-banner-close");
    const container = this.querySelector(".ad-banner-container");
    closeButton.addEventListener("click", () => {
      container.style.display = "none"; // 배너 숨기기
    });
  }
}

// 컴포넌트 등록
if (!customElements.get("ad-banner-component")) {
  customElements.define("ad-banner-component", AdBannerComponent);
}

export default AdBannerComponent;

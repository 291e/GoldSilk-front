class InstagramComponent extends HTMLElement {
  connectedCallback() {
    // 인스타그램 데이터 (이미지 URL)
    const images = ["https://picsum.photos/200/200"];

    // HTML 구조 생성
    this.innerHTML = `
                   <div class="swiper-text">
            <span><i class="fa-brands fa-instagram" style="color: #353535;font-size:24px"></i> INSTAGRAM</span>
            <span>상품을 이용하신 고객님들의 리얼 후기입니다!</span>
            </div>
        <div class="instagram-grid">
          ${images
            .map(
              (image) => `
            <div class="instagram-item">
              <img src="${image}" alt="Instagram Post" class="instagram-image" />
              <div class="instagram-overlay">
                <i class="fa-brands fa-instagram"></i>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
  }
}

// 컴포넌트 등록
if (!customElements.get("instagram-component")) {
  customElements.define("instagram-component", InstagramComponent);
}

// Intersection Observer로 컴포넌트 애니메이션 적용
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible"); // 컴포넌트가 보이면 애니메이션 클래스 추가
      } else {
        entry.target.classList.remove("fade-in-visible"); // 보이지 않으면 클래스 제거
      }
    });
  },
  {
    threshold: 0.1, // 10%만 보이면 애니메이션 실행
  }
);

export default InstagramComponent;

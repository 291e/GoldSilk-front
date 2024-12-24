class BannerComponent extends HTMLElement {
  connectedCallback() {
    // 배너 데이터
    const banners = [
      {
        image: "public/banner/main_banner01.jpg",
        title: "이벤트&프로모션",
        description: "황금단 이벤트 및 프로모션 안내입니다.",
      },
      {
        image: "public/banner/main_banner02.jpg",
        title: "상품문의",
        description: "궁금하신 사항은 언제든지 문의해주세요.",
      },
      {
        image: "public/banner/main_banner03.jpg",
        title: "고객후기",
        description: "고객님들의 후기 게시판입니다.",
      },
    ];

    // HTML 구조 생성
    this.innerHTML = `
          <div class="banner">
            ${banners
              .map(
                (banner) => `
              <div class="banner-container">
                <img src="${banner.image}" alt="${banner.title}" class="banner-image">
                <div class="banner-text">
                  <span>${banner.title}</span>
                  <span>${banner.description}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `;
  }

  // Shadow DOM 비활성화 (CSS 파일 적용을 위해)
  constructor() {
    super();
  }
}

customElements.define("banner-component", BannerComponent);

export default BannerComponent;

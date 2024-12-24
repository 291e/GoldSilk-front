class SliderComponent extends HTMLElement {
  connectedCallback() {
    // 슬라이드 이미지 데이터
    const images = [
      "public/slide/main_img01.jpg",
      "public/slide/main_img02.jpg",
      "public/slide/main_img03.jpg",
    ];

    this.innerHTML = `
          <div class="slider">
            <div class="slides">
              ${images.map((src) => `<img src="${src}" alt="Slide">`).join("")}
            </div>
            <button class="prev">
            <i class="fa-solid fa-circle-chevron-left"></i>
            </button>
            <button class="next">
            <i class="fa-solid fa-circle-chevron-right"></i>
            </button>
            <div class="pagination">
              <span class="page-indicator">1 / ${images.length}</span>
            </div>
          </div>
        `;

    // 요소 선택
    const slides = this.querySelector(".slides");
    const totalSlides = images.length;
    const prevButton = this.querySelector(".prev");
    const nextButton = this.querySelector(".next");
    const pageIndicator = this.querySelector(".page-indicator");

    let currentIndex = 0;

    // 슬라이드 업데이트 함수
    const updateSlider = () => {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      pageIndicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
    };

    // 이전 버튼 이벤트
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
      resetAutoSlide(); // 자동 슬라이드 초기화
    });

    // 다음 버튼 이벤트
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
      resetAutoSlide(); // 자동 슬라이드 초기화
    });

    // 자동 슬라이드
    const autoSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    };

    // 자동 슬라이드 타이머 설정
    const autoSlideInterval = 6000; // 6000ms = 6초
    let slideTimer = setInterval(autoSlide, autoSlideInterval);

    // 자동 슬라이드 초기화 함수
    const resetAutoSlide = () => {
      clearInterval(slideTimer); // 기존 타이머 정지
      slideTimer = setInterval(autoSlide, autoSlideInterval); // 새로운 타이머 시작
    };

    // 초기 슬라이드 표시
    updateSlider();
  }
}

// 컴포넌트 정의
customElements.define("slider-component", SliderComponent);

export default SliderComponent;

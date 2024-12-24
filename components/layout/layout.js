import HeaderComponent from "./HeaderComponent.js";
import FooterComponent from "./FooterCoponent.js";

/* 슬라이더 레이아웃 */

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
          <button class="prev">&lt;</button>
          <button class="next">&gt;</button>
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

/* 배너 컴포넌트 */
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

// Web Component 등록
customElements.define("banner-component", BannerComponent);
/* 추천상품 리스트 */
class RecommendComponent extends HTMLElement {
  connectedCallback() {
    // 슬라이드 데이터
    const products = [
      {
        id: 1,
        image: "public/product/product01.jpg",
        name: "Product 1",
        price: "$100",
      },
      {
        id: 2,
        image: "public/product/product02.jpg",
        name: "Product 2",
        price: "$120",
      },
      {
        id: 3,
        image: "public/product/product01.jpg",
        name: "Product 3",
        price: "$140",
      },
      {
        id: 4,
        image: "public/product/product02.jpg",
        name: "Product 4",
        price: "$160",
      },
      {
        id: 5,
        image: "public/product/product01.jpg",
        name: "Product 5",
        price: "$180",
      },
      {
        id: 6,
        image: "public/product/product02.jpg",
        name: "Product 6",
        price: "$200",
      },
      {
        id: 7,
        image: "public/product/product01.jpg",
        name: "Product 7",
        price: "$220",
      },
      {
        id: 8,
        image: "public/product/product02.jpg",
        name: "Product 8",
        price: "$240",
      },
      {
        id: 9,
        image: "public/product/product01.jpg",
        name: "Product 9",
        price: "$260",
      },
      {
        id: 10,
        image: "public/product/product02.jpg",
        name: "Product 10",
        price: "$280",
      },
    ];

    // HTML 구조 생성
    this.innerHTML = `
          <div class="swiper">
          <div class="swiper-text">
          <span>추천상품</span>
          <span>황금단이 추천하는 상품</span>
          </div>
            <div class="swiper-wrapper">
              ${products
                .map(
                  (product) => `
                  <div class="swiper-slide">
                    <div class="product" data-id="${product.id}">
                      <img src="${product.image}" alt="${product.name}" class="product-image">
                      <div class="product-overlay">
                        <div class="product-text">
                          <span>${product.name}</span>
                          <span>${product.price}</span>
                        </div>
                        <button class="buy-button">Buy Now</button>
                      </div>
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
            <!-- 네비게이션 버튼 -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
             <!-- 페이지네이션 -->
            <div class="swiper-pagination"></div>
         
          </div>
         
        `;

    // Swiper.js 초기화
    new Swiper(".swiper", {
      slidesPerView: 5, // 한 화면에 보이는 슬라이드 수
      spaceBetween: 20, // 슬라이드 간 간격
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
        delay: 3000, // 자동 슬라이드 간격 (3초)
        disableOnInteraction: false, // 상호작용 후에도 자동 슬라이드 유지
      },
    });

    // 상품 클릭 이벤트 추가
    this.querySelectorAll(".product").forEach((product) => {
      product.addEventListener("click", (e) => {
        const productId = e.currentTarget.dataset.id;
        if (productId) {
          window.location.href = `/product.html?id=${productId}`;
        }
      });
    });
  }
}

// 컴포넌트 정의
customElements.define("recommend-component", RecommendComponent);

/* 신상품 리스트 */
class NewProductComponent extends HTMLElement {
  connectedCallback() {
    // 신상품 데이터
    const products = [
      {
        image: "public/product/product01.jpg",
        name: "New Product 1",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 2",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 3",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 4",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 5",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 6",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 7",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 8",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 9",
        price: "1,000,000원",
        tag: "new",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 10",
        price: "1,000,000원",
        tag: "new",
      },
    ];

    // HTML 구조 생성
    this.innerHTML = `
          <div class="swiper-text">
          <span>신상품</span>
          <span>황금단에서 선보이는 신상품</span>
          </div>
      <div class="newProducts">

        ${products
          .map(
            (product) => `
            <div class="newProduct">
              <img src="${product.image}" alt="${product.name}" class="newProduct-image">
              <div class="newProduct-info">
                <div>
                  <span>${product.name}</span>
                  <span>${product.tag}</span>
                </div>
                <span>${product.price}</span>
              </div>
              <div class="newProduct-wishlistIcon">
                <i class="fa fa-heart"></i>
                
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
customElements.define("new-product-component", NewProductComponent);

/* 베스트 리스트 */
class BestProductComponent extends HTMLElement {
  connectedCallback() {
    // 신상품 데이터
    const products = [
      {
        image: "public/product/product01.jpg",
        name: "New Product 1",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 2",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 3",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 4",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 5",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 6",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 7",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 8",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product01.jpg",
        name: "New Product 9",
        price: "1,000,000원",
        tag: "BEST",
      },
      {
        image: "public/product/product02.jpg",
        name: "New Product 10",
        price: "1,000,000원",
        tag: "BEST",
      },
    ];

    // HTML 구조 생성
    this.innerHTML = `
          <div class="swiper-text">
          <span>베스트셀러</span>
          <span>황금단에서 인기있는 상품</span>
          </div>
      <div class="newProducts">

        ${products
          .map(
            (product) => `
            <div class="newProduct">
              <img src="${product.image}" alt="${product.name}" class="newProduct-image">
              <div class="bestProduct-info">
                <div>
                  <span>${product.name}</span>
                  <span>${product.tag}</span>
                </div>
                <span>${product.price}</span>
              </div>
              <div class="newProduct-wishlistIcon">
                <i class="fa fa-heart"></i>
                
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
customElements.define("best-product-component", BestProductComponent);

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

class ReviewSliderComponent extends HTMLElement {
  connectedCallback() {
    // 후기 데이터
    const reviews = [
      {
        image: "public/product/product01.jpg",
        title: "Excellent Service",
        content:
          "The service was fantastic, and the quality of the product exceeded my expectations!",
        name: "John Doe",
        stars: 5,
      },
      {
        image: "public/product/product02.jpg",
        title: "Amazing Experience",
        content:
          "I highly recommend this to anyone looking for great service and support.",
        name: "Jane Smith",
        stars: 5,
      },
      {
        image: "public/product/product01.jpg",
        title: "Very Satisfied",
        content:
          "Absolutely loved it! The team was helpful, and the product is top-notch.",
        name: "Emily Johnson",
        stars: 5,
      },
      {
        image: "public/product/product02.jpg",
        title: "Highly Recommend",
        content:
          "Great service, amazing products! Will definitely come back again.",
        name: "Michael Brown",
        stars: 5,
      },
      {
        image: "public/product/product01.jpg",
        title: "Outstanding Quality",
        content:
          "The quality is just outstanding! I'm really happy with my purchase.",
        name: "Laura Wilson",
        stars: 5,
      },
      {
        image: "public/product/product02.jpg",
        title: "Fantastic!",
        content:
          "Everything was perfect. I couldn't ask for more. Highly satisfied.",
        name: "Chris Green",
        stars: 5,
      },
    ];

    // HTML 구조 생성
    this.innerHTML = `
             <div class="swiper-text">
          <span>고객후기</span>
          <span>상품을 이용하신 고객님들의 리얼 후기입니다!</span>
          </div>
        <div class="swiper review-slider">
          <div class="swiper-wrapper">
            ${reviews
              .map(
                (review) => `
              <div class="swiper-slide review">
                <div class="review-image-wrapper">
                  <img src="${review.image}" alt="${
                  review.name
                }" class="review-image" />
                </div>
                <div class="review-text">
                  <span class="review-title">${review.title}</span>
                  <span class="review-content">${review.content}</span>
                  <span class="review-name">${review.name}</span>
                </div>
                <div class="review-name-line"></div>
                  <div class="review-stars">
                    ${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}
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
      slidesPerView: 5, // 한 화면에 보이는 슬라이드 수
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

class InstagramComponent extends HTMLElement {
  connectedCallback() {
    // 인스타그램 데이터 (이미지 URL)
    const images = [
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
      "https://picsum.photos/200/200",
    ];

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

// 모든 <new-product-component>를 관찰
document
  .querySelectorAll("new-product-component")
  .forEach((component) => observer.observe(component));
document
  .querySelectorAll("best-product-component")
  .forEach((component) => observer.observe(component));
document
  .querySelectorAll("review-slider-component")
  .forEach((component) => observer.observe(component));
document
  .querySelectorAll("longBanner-text")
  .forEach((component) => observer.observe(component));

/* 위젯 */
class WidgetComponent extends HTMLElement {
  connectedCallback() {
    // HTML 구조 생성
    this.innerHTML = `
        <div class="widget">
          <div class="widget-button" data-action="kakao"><i class="fa-regular fa-comment"></i></div>
          <div class="widget-button" data-action="instagram"><i class="fa-brands fa-instagram"></i></div>
          <div class="widget-button" data-action="blog"><i class="fa-brands fa-blogger"></i></div>
          <div class="widget-button" data-action="youtube"><i class="fa-brands fa-youtube"></i></div>
          <div class="widget-button" data-action="scroll-top"><i class="fa-solid fa-arrow-up"></i></div>
          <div class="widget-button" data-action="scroll-bottom"><i class="fa-solid fa-arrow-down"></i></div>
        </div>
      `;

    // 이벤트 리스너 등록
    this.querySelectorAll(".widget-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        switch (action) {
          case "kakao":
            alert("카카오톡 버튼 클릭");
            break;
          case "instagram":
            alert("인스타그램 버튼 클릭");
            break;
          case "blog":
            alert("네이버 블로그 버튼 클릭");
            break;
          case "youtube":
            alert("유튜브 버튼 클릭");
            break;
          case "scroll-top":
            window.scrollTo({ top: 0, behavior: "smooth" });
            break;
          case "scroll-bottom":
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
            break;
          default:
            console.log("알 수 없는 동작");
        }
      });
    });

    // 스크롤 이벤트 등록
    const widget = this.querySelector(".widget");
    widget.style.display = "none"; // 초기 상태: 숨김

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        widget.style.display = "flex"; // 스크롤 내리면 표시
      } else {
        widget.style.display = "none"; // 스크롤 위로 올라가면 숨김
      }
    });
  }
}

// 컴포넌트 등록
if (!customElements.get("widget-component")) {
  customElements.define("widget-component", WidgetComponent);
}

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

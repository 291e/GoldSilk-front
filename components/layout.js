import HeaderComponent from "./layout/HeaderComponent.js";
import FooterComponent from "./layout/FooterComponent.js";
import AdBanner from "./layout/AdBanner.js";
import Widget from "./layout/Widget.js";
import BannerComponent from "./slides/Banner.js";
import BestProductComponent from "./slides/Best.js";
import InstagramComponent from "./slides/Instagram.js";
import NewProductComponent from "./slides/NewProduct.js";
import RecommendComponent from "./slides/Recommend.js";
import ReviewSliderComponent from "./slides/Review.js";
import SliderComponent from "./slides/Slider.js";
import BrandInfoComponent from "./BrandInfo.js";

/* 위젯 */

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
  .querySelectorAll(".longBanner-text")
  .forEach((component) => observer.observe(component));
document
  .querySelectorAll("brandInfo-component")
  .forEach((component) => observer.observe(component));

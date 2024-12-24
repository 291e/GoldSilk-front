import { fetchProducts } from "../../api/api.js";
import RecommendComponent from "./slides/Recommend.js";
async function initialize() {
  try {
    // 데이터를 먼저 가져옴
    const products = await fetchProducts();
    console.log("Fetched Products:", products);

    // DOM에 RecommendComponent 추가
    const recommendComponent = document.createElement("recommend-component");
    recommendComponent.products = products; // 컴포넌트에 데이터 전달
    document.body.appendChild(recommendComponent);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    document.body.innerHTML = `<p>애플리케이션 초기화에 실패했습니다.</p>`;
  }
}

// 초기화 실행
initialize();

// API 요청을 보내 상품 데이터를 불러오는 함수
export async function fetchProducts() {
  const url = "https://d56c-218-150-126-143.ngrok-free.app/products"; // 엔드포인트 URL

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420", // ngrok 브라우저 경고 우회
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json(); // JSON 데이터 파싱
    return products;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

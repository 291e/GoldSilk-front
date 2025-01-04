import { fetchProductById, addToCart } from "../app/api.js"; // ID로 JSON 데이터를 가져오는 API 함수
import { formatImagePath } from "../components/utils/image.js";

// URL에서 상품 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("product_id"); // URL에서 product_id 가져오기

// 상품 렌더링 컨테이너
const productPage = document.getElementById("product-page");

// 어드민 여부 확인 (예: 토큰에서 is_admin 확인)
function isAdmin() {
  const token = localStorage.getItem("refresh_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.is_admin || false; // 토큰에 `is_admin` 필드가 있다고 가정
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return false;
  }
}

// 상품 데이터 렌더링 함수
async function renderProduct(product) {
  const images = product.images || [];
  const detailImages = product.detail_images || [];

  // 이미지 경로 비동기 처리
  const formattedImages = await Promise.all(
    images.map(async (img) => await formatImagePath(img))
  );

  const formattedDetailImages = await Promise.all(
    detailImages.map(async (img) => await formatImagePath(img))
  );

  productPage.innerHTML = `
  <div class="product-main">
   ${
     isAdmin()
       ? `<div class="admin-icon">
        <i class="fa-solid fa-gear" id="adminSettings"></i>
      </div>`
       : ""
   }
    <div id="product-${product.product_id}" class="product-container">
      <!-- 이미지 섹션 -->
      <div class="product-image-section">
        <div class="product-image-wrapper">
          <img src="${formattedImages[0]}" alt="${
    product.name
  }" class="product-image">
        </div>
            <div class="label-upload">
              <label for="face-input" class="upload-label">
                <div class="upload-ui">
                  <img id="upload-icon" src="public/Vector.png" alt="upload">
                  <span id="upload-text">얼굴 이미지</span>
                </div>
              </label>
              <input type="file" id="face-input" accept="image/*">
              <div class="generate">
                <button id="generate-button" class="generate-btn"><span style="font-weight:600">AI</span> 한복 입어보기</button>
                <div class="meta-style">
                <a href="https://www.metabank3d.com/" target="_blink">
                  <img style="scale:0.9" src="public/metaStyle.png" alt="메타스타일링">
                </a>
                </div>
                
              </div>
            </div>
        <div class="thumbnail-wrapper">
        ${
          formattedImages
            .map(
              (img, index) =>
                `<img src="${img}" alt="Thumbnail ${
                  index + 1
                }" class="thumbnail ${index === 0 ? "active" : ""}">`
            )
            .join("") || "<p>썸네일 이미지가 없습니다.</p>"
        }
        </div>
      </div>

      <!-- 상품 정보 섹션 -->
      <div class="product-info-section">
        <div class="product-col">
          <span>상품명</span>
          <span>${product.name}</span>
        </div>
        <div class="product-col">
          <span>판매가</span>
          <span>${product.price.toLocaleString()}원</span>
        </div>
        <div class="line-bar-product"></div>
        <div class="min-total">
          <span>(최소주문수량 1개 이상)</span>
          <span>수량을 선택해주세요.</span>
        </div>
        <div class="line-bar-product"></div>
        <div class="product-quantity">
          <label for="quantity">수량</label>
          <input type="number" id="quantity" name="quantity" value="1" min="1">
          <span class="total">${product.price.toLocaleString()}원</span>
        </div>
        <div class="line-bar-product"></div>
        <span class="product-total">총 상품금액(수량): ${product.price.toLocaleString()}원 (1개)</span>
        <div class="product-buttons">
          <button class="cart" data-product-id="${
            product.product_id
          }"><i class="fa-solid fa-cart-plus"></i></button>
          <button class="wish" data-product-id="${
            product.product_id
          }"><i class="fa-regular fa-heart"></i></button>
        </div>

        
        <!-- 라벨 업로드 및 결과물 -->
        <div class="label-result-section">
          <div class="upload-flex">

            <div class="result-image">
              <span id="result-text">AI 결과 이미지</span>
              <img id="generated-image" src="" alt="Generated Result" style="display: none; width: 300px; height: auto;">
            </div>

            <!-- Modal 구조 추가 -->
<div id="imageModal" class="modal">
  <span class="close-modal">&times;</span>
  <img class="modal-content" id="modalImage" />
</div>
          </div>
        </div>
        
      </div>
      
    </div>

<!-- 스크롤 섹션 -->
<div class="product-scroll">
  <div id="detail-section" class="content-section" data-section="Detail">
    <div class="detail-image">
    ${
      formattedDetailImages
        .map(
          (img, index) =>
            `<img src="${img}" alt="Thumbnail ${index + 1}" class="detail-img">`
        )
        .join("") || ""
    }
    </div>
  </div>

  <div id="info-section" class="content-section" data-section="Info">
    <div class="info-container">
    <!-- 왼쪽 내용 -->
    <div class="info-column">
      <h3>[ 상품결제정보 ]</h3>
      <p>고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.</p>
      <p>무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다.</p>
      <p>주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.</p>

      <h3>[ 교환 및 반품정보 ]</h3>
      <ul>
        <li>교환 및 반품 의사는 반드시 고객센터 또는 Q&A 게시판을 통해 요청해주셔야 합니다.</li>
        <li>예약 주문 및 주문 제작 제품은 반품 및 교환 불가합니다.</li>
        <li>주문제작 제품은 제작 진행 후 교환, 환불이 불가합니다. (소비자 요청에 의해 해외 발주가 진행된 제품 또는 방송 판매 제품 포함)</li>
        <li>고객이 직접 조립 및 시공을 진행하는 제품에 대해서는 조립 후 교환 및 반품이 불가합니다.</li>
        <li>고객의 사용 또는 고객의 책임 있는 사유로 상품의 가치가 하락 또는 훼손된 경우 교환 및 반품이 불가합니다.</li>
      </ul>


    </div>

    <!-- 가운데 선 -->
    <div class="divider"></div>

    <!-- 오른쪽 내용 -->
    <div class="info-column">

    <h3>[ 배송정보 ]</h3>
      <p>배송 방법: 택배</p>
      <p>배송 지역: 전국지역</p>
      <p>배송 비용: 무료</p>
      <p>배송 기간: 2일 ~ 7일</p>
      <p>배송 안내: 전 제품 무료 배송 및 설치 (도서, 산간, 해외 별도 요금)</p>
      <ul>
        <li>전자상거래법에 의거하여 교환 및 반품 요청은 수령일로부터 7일 이내입니다.</li>
        <li>제품의 자체적인 하자가 있는 경우 개봉 당시의 사진이 반드시 있어야 교환 및 반품 상담이 가능합니다.</li>
        <li>고객의 단순 변심이나 실수로 인한 반품 또는 교환의 경우 왕복 배송비는 고객이 부담합니다.</li>
        <li>교환/반품 시에는 제품에 따라 왕복배송비 (제품별 금액이 상이할 수 있으므로 고객센터 문의)를 부담하셔야 합니다.</li>
        <li>교환 및 반품은 택배사를 통해 수거하며, 제품/택/패키지 박스 등 보내드린 구성품 그대로 온전한 상태로 반송해주셔야 합니다.</li>
        <li>제품/택/패키지 박스 등에 훼손이 있어 교환 및 반품이 불가할 경우 재반송 처리됩니다.</li>
      </ul>

      <h3>[ 서비스문의 ]</h3>
      <p>문의는 042-385-1008 로 연락주세요.</p>

    </div>
  </div>
  </div>

  <div id="review-section" class="content-section" data-section="Review">
    <h2>Review</h2>
    <p>리뷰 내용이 여기에 들어갑니다...</p>
  </div>

  <div id="qa-section" class="content-section" data-section="Q&A">
    <h2>Q&A</h2>
    <p>질문과 답변 내용이 여기에 들어갑니다...</p>
  </div>
</div>


  `;
}

// 수량 변경 이벤트
function setupQuantityEvent(product) {
  const quantityInput = productPage.querySelector("#quantity");
  const totalPrice = productPage.querySelector(".product-total");
  const totalNum = productPage.querySelector(".total");

  if (!quantityInput || !totalPrice || !totalNum) return;

  quantityInput.addEventListener("input", (e) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    e.target.value = quantity;

    // 상품 가격을 기반으로 총 가격 계산
    totalPrice.textContent = `총 상품금액(수량): ${(
      product.price * quantity
    ).toLocaleString()}원 (${quantity}개)`;
    totalNum.textContent = `${(product.price * quantity).toLocaleString()}원`;
  });
}

async function initializeProductPage() {
  try {
    const product = await fetchProductById(productId); // fetchProductById로 상품 데이터 가져오기

    if (product) {
      await renderProduct(product); // 상품 렌더링

      // 어드민 아이콘 이벤트 설정
      if (isAdmin()) {
        const adminSettings = document.getElementById("adminSettings");
        adminSettings.addEventListener("click", () => {
          window.location.href = `https://goldsilkaws.metashopping.kr/editProduct/editProduct.html?product_id=${productId}`;
        });
      }

      // 초기화 함수 호출
      addScrollMenu();
      // 이벤트 추가
      setupEventListeners(product);
      setupQuantityEvent(product); // 수량 이벤트 초기화
      // 요소 선택
      const thumbnails = productPage.querySelectorAll(".thumbnail");
      const mainImage = productPage.querySelector(".product-image");
      const faceInput = productPage.querySelector("#face-input");
      const generateButton = productPage.querySelector("#generate-button");
      const resultImage = document.querySelector("#generated-image");
      const resultImageContainer = document.querySelector(".result-image");
      const uploadUi = document.querySelector(".upload-ui");
      const modal = document.querySelector("#imageModal");
      const modalImage = document.querySelector("#modalImage");
      const closeModal = document.querySelector(".close-modal");

      // 로딩 애니메이션 요소
      const loadingAnimation = document.createElement("div");
      loadingAnimation.id = "loading";
      loadingAnimation.innerHTML = `
  <div class="loading-spinner"></div>
  <p>생성 중...</p>
`;
      loadingAnimation.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  flex-direction: column;
  font-size: 13px;
  text-align: center;
  z-index: 9999;
  display: none; 
  width:100%;
  height:100%;
`;
      // 로딩 애니메이션을 result-image 내부에 추가
      uploadUi.style.position = "relative"; // 부모 요소에 상대 위치 지정
      uploadUi.appendChild(loadingAnimation);
      // // 썸네일 클릭 이벤트
      // thumbnails.forEach((thumbnail, index) => {
      //   thumbnail.addEventListener("click", () => {
      //     if (isImageSwapped) {
      //       console.log("합성 이미지 상태에서는 썸네일 클릭을 무시합니다.");
      //       return;
      //     }

      //     mainImage.src = product.images[index];
      //     thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      //     thumbnail.classList.add("active");
      //   });
      // });

      let isImageSwapped = false; // Initialize the variable to track image swap status

      // '생성하기' 버튼 클릭 이벤트
      generateButton.addEventListener("click", async function () {
        const faceFile = faceInput.files[0];

        if (!faceFile) {
          alert("얼굴 사진을 업로드해주세요.");
          return;
        }

        try {
          // 로딩 애니메이션 시작
          loadingAnimation.style.display = "flex";
          loadingAnimation.style.alignItems = "center";
          loadingAnimation.style.justifyContent = "center";

          document.querySelector("#result-text").style.display = "none";

          const formData = new FormData();
          formData.append("face_file", faceFile);

          // 메인 이미지 합성
          let mainImageResult = null;
          const response = await fetch(mainImage.src, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch target file: ${response.statusText}`
            );
          }

          const blob = await response.blob();
          const targetFile = new File([blob], "main_image.jpg", {
            type: blob.type,
          });
          formData.append("target_file", targetFile);

          const serverResponse = await fetch(
            "https://goldsilkaws.metashopping.kr/face",
            { method: "POST", body: formData }
          );

          if (!serverResponse.ok) {
            throw new Error(`Server Error: ${serverResponse.statusText}`);
          }

          const responseData = await serverResponse.json();
          if (responseData.image_base64) {
            const base64Image = responseData.image_base64;

            mainImage.src = `data:image/png;base64,${base64Image}`;
            resultImage.src = `data:image/png;base64,${base64Image}`;
            resultImage.style.display = "block";

            isImageSwapped = true; // Set the flag to true after successful swap
            mainImage.style.cursor = "pointer"; // 클릭 가능하도록 스타일 변경
            console.log("합성 이미지 적용 완료!");

            // 합성 완료 후 클릭 이벤트 등록
            mainImage.addEventListener("click", () => {
              if (mainImage.src) {
                modalImage.src = mainImage.src;
                modal.style.display = "flex";
              }
            });
          }

          // 디테일 이미지 합성
          const detailImageElements =
            productPage.querySelectorAll(".detail-img");
          for (const detailImageElement of detailImageElements) {
            const detailImageSrc = detailImageElement.src;

            // 디테일 이미지 합성
            const detailResponse = await fetch(detailImageSrc, {
              method: "GET",
            });

            if (!detailResponse.ok) {
              throw new Error(
                `Failed to fetch detail image: ${detailResponse.statusText}`
              );
            }

            const detailBlob = await detailResponse.blob();
            const detailTargetFile = new File(
              [detailBlob],
              "detail_image.jpg",
              {
                type: detailBlob.type,
              }
            );
            formData.append("detail_target_file", detailTargetFile);

            const detailServerResponse = await fetch(
              "https://goldsilkaws.metashopping.kr/face",
              { method: "POST", body: formData }
            );

            if (!detailServerResponse.ok) {
              throw new Error(
                `Server Error for detail image: ${detailServerResponse.statusText}`
              );
            }

            const detailResponseData = await detailServerResponse.json();
            if (detailResponseData.image_base64) {
              const detailBase64Image = detailResponseData.image_base64;
              detailImageElement.src = `data:image/png;base64,${detailBase64Image}`;
            }
          }
        } catch (error) {
          console.error("Error during face swap process:", error.message);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
          // 로딩 애니메이션 종료
          loadingAnimation.style.display = "none";
        }
      });

      // 모달 닫기
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });

      // 모달 외부 클릭 시 닫기
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      // 파일 업로드 및 미리보기
      faceInput.addEventListener("change", function () {
        const file = faceInput.files[0];
        const uploadUi = document.querySelector(".upload-ui");
        const uploadIcon = document.querySelector("#upload-icon");

        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            uploadUi.style.backgroundImage = `url(${e.target.result})`;
            uploadUi.style.border = "none";
            uploadIcon.style.display = "none";
            document.querySelector("#upload-text").style.display = "none";
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      productPage.innerHTML = `<h1>404 - 상품을 찾을 수 없습니다.</h1>`;
    }
  } catch (error) {
    console.error("Failed to load product:", error);
    productPage.innerHTML = `<p>상품 데이터를 불러오는 데 실패했습니다.</p>`;
  }

  function setupEventListeners(product) {
    const cartButton = document.querySelector(".cart");
    cartButton?.addEventListener("click", async (e) => {
      e.preventDefault();

      const productId = product.product_id;

      if (!productId) {
        alert("유효하지 않은 상품입니다.");
        return;
      }

      try {
        const result = await addToCart(productId, 1);

        if (result) {
          alert("장바구니에 상품이 추가되었습니다!");
        }
      } catch (error) {
        console.error("Error adding to cart:", error.message);
        alert("장바구니 추가 중 오류가 발생했습니다.");
      }
    });
  }
}

// 초기화 함수 호출
initializeProductPage();

// 스크롤 메뉴 버튼 생성 및 삽입
function addScrollMenu() {
  const sections = document.querySelectorAll(".content-section");

  sections.forEach((section) => {
    const scrollMenu = document.createElement("div");
    scrollMenu.className = "scroll-menu";
    scrollMenu.innerHTML = ` <button data-scroll-target="detail-section">Detail</button>
      <button data-scroll-target="info-section">Info</button>
      <button data-scroll-target="review-section">Review</button>
      <button data-scroll-target="qa-section">Q&A</button> `;
    section.before(scrollMenu);
  });

  // 메뉴 클릭 이벤트
  document.querySelectorAll(".scroll-menu button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = document.getElementById(e.target.dataset.scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

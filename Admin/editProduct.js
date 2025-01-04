import {
  uploadProductImages,
  updateProductAttributes,
  deleteProduct,
} from "../services/adminService.js";
import { fetchProductById } from "../app/api.js";
import { formatImagePath } from "../components/utils/image.js";

// URL에서 상품 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("product_id");

// 어드민 여부 확인
function isAdmin() {
  const token = localStorage.getItem("refresh_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.is_admin || false;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return false;
  }
}

// 어드민 체크
function redirectIfNotAdmin() {
  if (!isAdmin()) {
    alert("어드민 계정만 접근 가능합니다.");
    window.location.href = "/";
  }
}

// 초기 실행
redirectIfNotAdmin();

// DOM 요소 가져오기
const nameInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");
const categoryInput = document.getElementById("productCategory");
const tagsInput = document.getElementById("productTags");
const mainImageInput = document.getElementById("mainImage");
const detailImagesInput = document.getElementById("detailImages");
const currentMainImage = document.getElementById("currentMainImage");
const currentDetailImages = document.getElementById("currentDetailImages");
const messageBox = document.getElementById("messageBox");
const updateAttributesButton = document.getElementById(
  "updateAttributesButton"
);
const updateImagesButton = document.getElementById("updateImagesButton");
const backButton = document.getElementById("backToProductButton");
const resetMainImageButton = document.getElementById("resetMainImageButton");
const resetDetailImageButton = document.getElementById(
  "resetDetailImageButton"
);

// 기존 이미지 저장
const originalImages = {
  main: null,
  detail: null,
};

// 상품 정보 로드
async function loadProductData() {
  try {
    const productData = await fetchProductById(productId);
    if (!productData) {
      alert("상품을 찾을 수 없습니다.");
      window.location.href = "/admin/products.html";
      return;
    }

    // 필드 데이터 로드
    nameInput.value = productData.name || "";
    priceInput.value = productData.price || "";
    categoryInput.value = productData.category || "";
    tagsInput.value = productData.tags ? productData.tags.join(", ") : "";

    // 이미지 데이터 로드
    originalImages.main = await formatImagePath(productData.images[0]);
    originalImages.detail = await formatImagePath(productData.detail_images[0]);

    currentMainImage.src = originalImages.main;
    currentDetailImages.src = originalImages.detail;
  } catch (error) {
    console.error("Error loading product data:", error.message);
    alert("상품 데이터를 불러오는 데 실패했습니다.");
  }
}

// 속성 수정
async function handleUpdateAttributes() {
  try {
    const updates = {
      name: nameInput.value.trim(),
      price: priceInput.value.trim(),
      category: categoryInput.value.trim(),
      tags: tagsInput.value.split(",").map((tag) => tag.trim()),
    };
    await updateProductAttributes(productId, updates);
    messageBox.textContent = "속성이 성공적으로 수정되었습니다.";
    messageBox.style.color = "green";
  } catch (error) {
    console.error(error.message);
    messageBox.textContent = "속성 수정에 실패했습니다.";
    messageBox.style.color = "red";
  }
}

// 이미지 수정
async function handleUpdateImages() {
  try {
    const mainImage = mainImageInput.files[0] || null;
    const detailImage = detailImagesInput.files[0] || null;
    if (!mainImage && !detailImage) {
      alert("업로드할 이미지가 없습니다.");
      return;
    }
    await uploadProductImages(productId, mainImage, detailImage);
    messageBox.textContent = "이미지가 성공적으로 수정되었습니다.";
    messageBox.style.color = "green";

    // 미리보기 업데이트
    if (mainImage) updateImagePreview(mainImageInput, "currentMainImage");
    if (detailImage)
      updateImagePreview(detailImagesInput, "currentDetailImages");
  } catch (error) {
    console.error(error.message);
    messageBox.textContent = "이미지 수정에 실패했습니다.";
    messageBox.style.color = "red";
  }
}

// 이미지 미리보기 업데이트
function updateImagePreview(fileInput, imageElementId) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById(imageElementId).src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 이미지 초기화
function resetMainImage() {
  currentMainImage.src = originalImages.main;
  mainImageInput.value = "";
}

function resetDetailImage() {
  currentDetailImages.src = originalImages.detail;
  detailImagesInput.value = "";
}

// 돌아가기 버튼
backButton.addEventListener("click", () => {
  window.location.href = `/product.html?product_id=${productId}`;
});

// 이벤트 리스너 등록
updateAttributesButton.addEventListener("click", handleUpdateAttributes);
updateImagesButton.addEventListener("click", handleUpdateImages);
resetMainImageButton.addEventListener("click", resetMainImage);
resetDetailImageButton.addEventListener("click", resetDetailImage);

// 초기화
loadProductData();

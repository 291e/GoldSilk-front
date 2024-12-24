export function renderProductInfo(product) {
  return `
      <div class="product-info-section">
        <div class="product-col">
          <span>상품명</span>
          <span>${product.name || "상품명 없음"}</span>
        </div>
        <div class="product-col">
          <span>판매가</span>
          <span>${product.price?.toLocaleString() || "N/A"}원</span>
        </div>
        <div class="line-bar-product"></div>
        <div class="product-quantity">
          <label for="quantity">수량</label>
          <input type="number" id="quantity" name="quantity" value="1" min="1">
          <span class="total">${
            product.price?.toLocaleString() || "N/A"
          }원</span>
        </div>
        <div class="line-bar-product"></div>
        <span class="product-total">총 상품금액(수량): ${
          product.price?.toLocaleString() || "N/A"
        }원 (1개)</span>
      </div>`;
}

export function addQuantityListeners(product) {
  const quantityInput = document.querySelector("#quantity");
  const totalPrice = document.querySelector(".product-total");
  const totalNum = document.querySelector(".total");
  quantityInput.addEventListener("input", (e) => {
    const quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    e.target.value = quantity;
    totalPrice.textContent = `총 상품금액(수량): ${(
      product.price * quantity
    ).toLocaleString()}원 (${quantity}개)`;
    totalNum.textContent = `${(product.price * quantity).toLocaleString()}원`;
  });
}

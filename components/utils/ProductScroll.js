export function renderScrollSections(product) {
  const detailImages = product.detailImages || [];
  return `
      <div class="product-scroll">
        <div id="detail-section" class="content-section" data-section="Detail">
          <div class="detail-image">
            ${detailImages
              .map(
                (img) =>
                  `<img src="${img}" alt="디테일 이미지" class="detail-img">`
              )
              .join("")}
          </div>
        </div>
        <div id="info-section" class="content-section" data-section="Info">
          <h3>배송 및 교환 정보</h3>
          <p>상품 관련 정보...</p>
        </div>
      </div>`;
}

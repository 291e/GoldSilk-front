import { formatImagePath } from "../utils/image.js";

export function renderProductImage(product) {
  const images = product.images || [];
  return `
    <div class="product-image-section">
      <div class="product-image-wrapper">
        <img src="${formatImagePath(images[0])}" alt="${
    product.name
  }" class="product-image">
      </div>
      <div class="thumbnail-wrapper">
        ${images
          .map(
            (img, index) =>
              `<img src="${formatImagePath(img)}" alt="Thumbnail ${index + 1}" 
                    class="thumbnail ${index === 0 ? "active" : ""}">`
          )
          .join("")}
      </div>
    </div>`;
}

export function addThumbnailListeners(product) {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.querySelector(".product-image");
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      mainImage.src = formatImagePath(product.images[index]);
      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      thumbnail.classList.add("active");
    });
  });
}

export default class FaceSwapComponent {
  constructor({
    mainImage,
    detailImages,
    faceInput,
    generateButton,
    resultImageContainer,
    proxyURL,
  }) {
    this.mainImage = mainImage;
    this.detailImages = detailImages;
    this.faceInput = faceInput;
    this.generateButton = generateButton;
    this.resultImageContainer = resultImageContainer;
    this.proxyURL = proxyURL;
    this.isImageSwapped = false;

    this.loadingAnimation = this.createLoadingAnimation();
    this.resultImageContainer.appendChild(this.loadingAnimation);

    this.initializeEvents();
  }

  initializeEvents() {
    this.generateButton.addEventListener("click", () => this.handleFaceSwap());
    this.faceInput.addEventListener("change", () => this.previewUploadedFace());
  }

  createLoadingAnimation() {
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>생성 중...</p>
      `;
    loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        z-index: 9999;
        display: none;
        width: 100%;
        height: 100%;
      `;
    return loadingDiv;
  }

  showLoading() {
    this.loadingAnimation.style.display = "flex";
  }

  hideLoading() {
    this.loadingAnimation.style.display = "none";
  }

  previewUploadedFace() {
    const file = this.faceInput.files[0];
    const uploadUi = document.querySelector(".upload-ui");
    const uploadIcon = document.querySelector("#upload-icon");

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadUi.style.backgroundImage = `url(${e.target.result})`;
        uploadUi.style.border = "none";
        uploadIcon.style.display = "none";
        document.querySelector("#upload-text").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  }

  async fetchImageBlob(url) {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return response.blob();
  }

  async fetchFaceSwap(formData) {
    const response = await fetch(this.proxyURL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`);
    }
    return response.json();
  }

  async handleFaceSwap() {
    const faceFile = this.faceInput.files[0];

    if (!faceFile) {
      alert("얼굴 사진을 업로드해주세요.");
      return;
    }

    try {
      this.showLoading();

      const formData = new FormData();
      formData.append("face_file", faceFile);

      // 메인 이미지 합성
      const mainBlob = await this.fetchImageBlob(this.mainImage.src);
      formData.append("target_file", new File([mainBlob], "main_image.jpg"));

      const mainResponseData = await this.fetchFaceSwap(formData);
      this.applyImage(this.mainImage, mainResponseData.image_base64);
      this.isImageSwapped = true;

      // 디테일 이미지 합성
      for (const detailImage of this.detailImages) {
        const detailBlob = await this.fetchImageBlob(detailImage.src);
        formData.append(
          "detail_target_file",
          new File([detailBlob], "detail_image.jpg")
        );

        const detailResponseData = await this.fetchFaceSwap(formData);
        this.applyImage(detailImage, detailResponseData.image_base64);
      }

      console.log("AI 합성 완료!");
    } catch (error) {
      console.error("AI 합성 오류:", error.message);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      this.hideLoading();
    }
  }

  applyImage(targetElement, base64Data) {
    targetElement.src = `data:image/png;base64,${base64Data}`;
  }
}

class BrandInfoComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div class="longBanner-text">
          <span>Brand Information</span>
          <span
            >황금단은 전통 한복 특유의 아름다움에 독창적인 디자인을 접목해,
            <br />
            오트쿠튀르를 표방하는 한국 전통 브랜드입니다.</span
          >
          <button class="moreBtn">
            <p>More</p>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
              `;
  }
}
customElements.define("brand-info-component", BrandInfoComponent);

export default BrandInfoComponent;

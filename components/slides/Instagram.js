class InstagramComponent extends HTMLElement {
  connectedCallback() {
    // LightWidget embed code
    const lightWidgetScriptURL =
      "https://cdn.lightwidget.com/widgets/lightwidget.js";
    const lightWidgetIframeURL =
      "https://cdn.lightwidget.com/widgets/103227f80a8357229f2926233ea54b57.html";

    // HTML 구조 생성
    this.innerHTML = `
      <div class="instagram-section">
        <div class="swiper-text">
          <span><i class="fa-brands fa-instagram" style="color: #353535;font-size:24px"></i> INSTAGRAM</span>
          <span>상품을 이용하신 고객님들의 리얼 후기입니다!</span>
        </div>
        <div class="instagram-widget">
                <iframe
          src="${lightWidgetIframeURL}" 
          scrolling="no"
          allowtransparency="true"
          class="lightwidget-widget"
          style="width: 100%; border: 0px; overflow: hidden; height: 395px"
        ></iframe>
          
        </div>
      </div>
    `;

    // LightWidget script 추가
    const script = document.createElement("script");
    script.src = lightWidgetScriptURL;
    script.async = true;
    this.appendChild(script);
  }
}

// 컴포넌트 등록
if (!customElements.get("instagram-component")) {
  customElements.define("instagram-component", InstagramComponent);
}

export default InstagramComponent;

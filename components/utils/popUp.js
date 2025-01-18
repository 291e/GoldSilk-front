class PopupComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.popup = null;
    this.init();
  }

  // 쿠키 설정 함수
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  // 쿠키 가져오기 함수
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // 팝업 HTML 생성
  createPopup() {
    this.popup = document.createElement("div");
    this.popup.className = "popup";
    this.popup.innerHTML = `
        <div class="popup-content">
          <img
              src="/public/popUp/popup.jpeg"
              alt="popup"
            />
          <div class="btn-flex">  
          <button id="closePopup">닫기</button>
          <button id="closeForWeek">일주일 동안 닫기</button>
          </div>
          </div>
      `;
    this.container.appendChild(this.popup);
  }

  // 팝업 표시
  showPopup() {
    if (!this.getCookie("popupClosed")) {
      this.popup.style.display = "block";
    }
  }

  // 팝업 닫기
  closePopup() {
    this.popup.style.display = "none";
  }

  // 이벤트 초기화
  setupEventListeners() {
    const closePopupButton = this.popup.querySelector("#closePopup");
    const closeForWeekButton = this.popup.querySelector("#closeForWeek");

    closePopupButton.addEventListener("click", () => {
      this.closePopup();
    });

    closeForWeekButton.addEventListener("click", () => {
      this.setCookie("popupClosed", "true", 7); // 7일 동안 쿠키 설정
      this.closePopup();
    });
  }

  // 초기화
  init() {
    this.createPopup();
    this.setupEventListeners();
    this.showPopup();
  }
}

// 팝업 컴포넌트 초기화
document.addEventListener("DOMContentLoaded", () => {
  new PopupComponent("popup-container");
});

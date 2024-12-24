class WidgetComponent extends HTMLElement {
  connectedCallback() {
    // HTML 구조 생성
    this.innerHTML = `
          <div class="widget">
            <div class="widget-button" data-action="kakao"><i class="fa-regular fa-comment"></i></div>
            <div class="widget-button" data-action="instagram"><i class="fa-brands fa-instagram"></i></div>
            <div class="widget-button" data-action="blog"><i class="fa-brands fa-blogger"></i></div>
            <div class="widget-button" data-action="youtube"><i class="fa-brands fa-youtube"></i></div>
            <div class="widget-button" data-action="scroll-top"><i class="fa-solid fa-arrow-up"></i></div>
            <div class="widget-button" data-action="scroll-bottom"><i class="fa-solid fa-arrow-down"></i></div>
          </div>
        `;

    // 스크롤 이동 함수
    const smoothScroll = (target, callback) => {
      const currentScroll = window.scrollY;
      const distance = target - currentScroll;
      const step = distance / 30; // 스크롤 단계
      let currentStep = 0;

      const scrollInterval = setInterval(() => {
        if (
          currentStep >= 30 ||
          Math.abs(window.scrollY - target) < Math.abs(step)
        ) {
          clearInterval(scrollInterval);
          window.scrollTo({ top: target });
          if (callback) callback(); // 콜백 호출
        } else {
          window.scrollBy(0, step);
          currentStep++;
        }
      }, 30);
    };

    // 이벤트 리스너 등록
    this.querySelectorAll(".widget-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;
        switch (action) {
          case "kakao":
            alert("카카오톡 버튼 클릭");
            break;
          case "instagram":
            alert("인스타그램 버튼 클릭");
            break;
          case "blog":
            alert("네이버 블로그 버튼 클릭");
            break;
          case "youtube":
            alert("유튜브 버튼 클릭");
            break;
          case "scroll-top":
            smoothScroll(0);
            break;
          case "scroll-bottom":
            smoothScroll(document.body.scrollHeight);
            break;
          default:
            console.log("알 수 없는 동작");
        }
      });
    });

    // 스크롤 이벤트 등록
    const widget = this.querySelector(".widget");
    let widgetVisible = false; // 위젯 상태 플래그
    let isScrolling = false; // 스크롤 동작 중인지 여부

    const updateWidgetVisibility = () => {
      if (!isScrolling) {
        if (window.scrollY > 100) {
          if (!widgetVisible) {
            widget.style.display = "flex"; // 위젯 표시
            widgetVisible = true;
          }
        } else {
          if (widgetVisible) {
            widget.style.display = "none"; // 위젯 숨김
            widgetVisible = false;
          }
        }
      }
    };

    // 스크롤 이벤트 핸들러
    window.addEventListener("scroll", updateWidgetVisibility);

    // 스크롤 중 플래그 처리
    const setScrollingFlag = (isScroll) => {
      isScrolling = isScroll;
      if (!isScroll) updateWidgetVisibility(); // 플래그 해제 시 위젯 상태 확인
    };

    // Smooth Scroll에 플래그 처리
    this.querySelectorAll(
      "[data-action='scroll-top'], [data-action='scroll-bottom']"
    ).forEach((button) => {
      button.addEventListener("click", () => {
        setScrollingFlag(true);
        smoothScroll(
          button.dataset.action === "scroll-top"
            ? 0
            : document.body.scrollHeight,
          () => setScrollingFlag(false)
        );
      });
    });

    // 초기 위젯 상태 설정
    updateWidgetVisibility();
  }
}

// 컴포넌트 등록
if (!customElements.get("widget-component")) {
  customElements.define("widget-component", WidgetComponent);
}

export default WidgetComponent;

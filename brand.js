function initializeBrandPage() {
  const introBtn = document.querySelector("#intro-btn");
  const historyBtn = document.querySelector("#history-btn");
  const introContent = document.querySelector("#brand-intro");
  const historyContent = document.querySelector("#brand-history");
  const map = document.querySelector(".map");

  if (!introBtn || !historyBtn || !introContent || !historyContent) {
    console.error("Brand page elements not found");
    return;
  }

  introBtn.addEventListener("click", () => {
    introBtn.classList.add("active");
    historyBtn.classList.remove("active");
    introContent.classList.remove("hidden");
    historyContent.classList.add("hidden");
    map.classList.remove("hidden");
  });

  historyBtn.addEventListener("click", () => {
    historyBtn.classList.add("active");
    introBtn.classList.remove("active");
    historyContent.classList.remove("hidden");
    introContent.classList.add("hidden");
    map.classList.add("hidden");
  });
}

// 페이지 로드 후 초기화
initializeBrandPage();

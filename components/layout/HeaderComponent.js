import { fetchUserProfile } from "../../services/auth.js";

class HeaderComponent extends HTMLElement {
  async connectedCallback() {
    const menuItems = [
      { name: "BRAND", link: "/brand.html" },
      { name: "혼주한복", link: "/product/honju.html" },
      { name: "신랑신부한복", link: "/product/wedding.html" },
      { name: "여성한복", link: "/product/women.html" },
      { name: "아동한복", link: "/product/children.html" },
      { name: "돌잔치한복", link: "/product/firstbirthday.html" },
      { name: "맞춤한복", link: "/product/custom.html" },
      { name: "생활한복", link: "/product/daily.html" },
      { name: "화보촬영", link: "/Community/photoshoot.html" },
      { name: "협찬", link: "/Community/sponsorship.html" },
      { name: "COMMUNITY", link: "/Community/community.html" },
    ];

    let profileLink = "/user/login.html"; // 기본 로그인 링크 설정
    let cartLink = "/Cart/cart.html"; // 기본 장바구니 링크 설정
    let isLoggedIn = false; // 로그인 여부

    // 로그인 상태 확인
    try {
      const user = await fetchUserProfile();
      if (user) {
        profileLink = "/user/profile.html"; // 로그인된 경우 프로필 페이지
        isLoggedIn = true;
      }
    } catch (error) {
      console.warn("User not logged in or session expired.");
    }

    this.innerHTML = `
      <div class="header-placeholder"></div>
      <div class="header headerRelative">
        <div class="inner">
          <!-- 로고 -->
          <a href="/" class="logo-wrapper">
            <img src="/public/logo.jpg" alt="logo" class="logo" />
          </a>

          <!-- 데스크톱 메뉴 -->
          <nav class="menu">
            ${menuItems
              .map(
                (item) =>
                  `<a href="${item.link}" class="innerHeader">${item.name}</a>`
              )
              .join("")}
          </nav>

          <!-- 사용자 아이콘 -->
          <a class="user-icon" href="${
            isLoggedIn ? profileLink : "/user/login.html"
          }">
            ${
              isLoggedIn
                ? '<i class="fa-regular fa-user"></i>'
                : '<i class="fa-solid fa-user-plus"></i>'
            }
          </a>

          <!-- 장바구니 아이콘 -->
          <a class="user-icon" href="${
            isLoggedIn ? cartLink : "/user/login.html"
          }">
            <i class="fa-solid fa-cart-shopping"></i>
          </a>

          <!-- 햄버거 메뉴 -->
          <div class="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <!-- 모바일 메뉴 -->
        <div class="mobile-menu">
          ${menuItems
            .map(
              (item) =>
                `<a href="${item.link}" class="mobile-menu-item">${item.name}</a>`
            )
            .join("")}
          <a class="mobile-menu-item" href="${
            isLoggedIn ? profileLink : "/user/login.html"
          }">
            ${isLoggedIn ? "Profile" : "Login"}
          </a>
          <a class="mobile-menu-item" href="${
            isLoggedIn ? cartLink : "/user/login.html"
          }">
            장바구니
          </a>
        </div>
      </div>
    `;

    this.addScrollListener();
    this.addHamburgerMenuListeners();
  }

  addHamburgerMenuListeners() {
    const hamburgerIcon = this.querySelector(".hamburger-icon");
    const mobileMenu = this.querySelector(".mobile-menu");

    hamburgerIcon.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      if (mobileMenu.classList.contains("open")) {
        mobileMenu.style.display = "flex"; // 메뉴가 펼쳐지도록 처리
      } else {
        mobileMenu.style.display = "none"; // 메뉴가 닫히도록 처리
      }
    });

    // 메뉴 외부 클릭 시 메뉴 닫기
    document.addEventListener("click", (event) => {
      const isClickInsideMenu =
        mobileMenu.contains(event.target) ||
        hamburgerIcon.contains(event.target);
      if (!isClickInsideMenu) {
        mobileMenu.classList.remove("open");
        mobileMenu.style.display = "none";
      }
    });
  }

  addScrollListener() {
    const header = this.querySelector(".header");
    const placeholder = this.querySelector(".header-placeholder");

    if (!header || !placeholder) {
      console.warn("Header or placeholder not found.");
      return;
    }

    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        header.classList.add("headerFixed");
        placeholder.style.height = `${header.offsetHeight}px`; // 헤더 높이를 유지하여 페이지 이동 방지
      } else {
        header.classList.remove("headerFixed");
        placeholder.style.height = "0"; // 원래 상태로 복구
      }
    });
  }
}

customElements.define("header-component", HeaderComponent);

export default HeaderComponent;

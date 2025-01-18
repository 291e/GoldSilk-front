import { getCartItems } from "../../services/cartService.js";
import { getUserProfile } from "../../services/userService.js"; // JWT 기반 사용자 정보 가져오기

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

    let userState = {
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    };

    let cartItems = [];

    try {
      // 사용자 상태 초기화
      userState = await initializeUserState();
    } catch (error) {
      console.warn("User state initialization failed:", error.message);
    }

    try {
      // 장바구니 아이템 가져오기
      cartItems = await getCartItems();
    } catch (error) {
      console.warn("Error fetching cart items:", error.message);
    }

    // 헤더 렌더링
    this.renderHeader(
      menuItems,
      userState.isAuthenticated,
      userState.user,
      userState.isAdmin,
      cartItems.length
    );

    this.addHamburgerMenuListeners();
    this.addScrollListener();
  }

  renderHeader(menuItems, isAuthenticated, user, isAdmin, cartItemCount) {
    const profileLink = isAuthenticated
      ? "/user/profile.html"
      : "/user/login.html";
    const cartLink = isAuthenticated ? "/Cart/cart.html" : "/user/login.html";

    this.innerHTML = `
      <div class="header-placeholder"></div>
      <div class="header headerRelative">
        <div class="inner">
          <a href="/" class="logo-wrapper">
            <img src="/public/logo.jpg" alt="logo" class="logo" />
          </a>
          <nav class="menu">
            ${menuItems
              .map(
                (item) =>
                  `<a href="${item.link}" class="innerHeader">${item.name}</a>`
              )
              .join("")}
          </nav>
          <div class="user-text">
            ${
              isAuthenticated
                ? `
                  <a class="user-icon" href="${profileLink}">
                    <i class="fa-regular fa-user"></i>
                    <span class="user-name" style="font-size:14px; white-space:nowrap;">${
                      user.username
                    }님</span>
                  </a>
                  <a class="user-icon cart-wrapper" href="${cartLink}">
                    <i class="fa-solid fa-cart-shopping" style="position:relative;">
                      ${
                        cartItemCount > 0
                          ? `<span class="cart-count">${cartItemCount}</span>`
                          : ""
                      }
                    </i>
                  </a>
                `
                : `
                  <a class="user-icon" href="${profileLink}">
                    <i class="fa-solid fa-user-plus"></i>
                  </a>
                  <a class="user-icon cart-wrapper" href="${cartLink}">
                    <i class="fa-solid fa-cart-shopping" style="position:relative;">
                      ${
                        cartItemCount > 0
                          ? `<span class="cart-count">${cartItemCount}</span>`
                          : ""
                      }
                    </i>
                  </a>
                `
            }
          </div>
          <div class="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="mobile-menu">
          ${menuItems
            .map(
              (item) =>
                `<a href="${item.link}" class="mobile-menu-item">${item.name}</a>`
            )
            .join("")}
          <a class="mobile-menu-item" href="${profileLink}">
            ${isAuthenticated ? `Profile (${user?.username || ""})` : "Login"}
          </a>
          <a class="mobile-menu-item" href="${cartLink}">장바구니</a>
        </div>
      </div>
    `;
  }

  addHamburgerMenuListeners() {
    const hamburgerIcon = this.querySelector(".hamburger-icon");
    const mobileMenu = this.querySelector(".mobile-menu");

    hamburgerIcon.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      mobileMenu.style.display = mobileMenu.classList.contains("open")
        ? "flex"
        : "none";
    });

    document.addEventListener("click", (event) => {
      const isClickInside =
        mobileMenu.contains(event.target) ||
        hamburgerIcon.contains(event.target);
      if (!isClickInside) {
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
        placeholder.style.height = `${header.offsetHeight}px`;
      } else {
        header.classList.remove("headerFixed");
        placeholder.style.height = "0";
      }
    });
  }
}

// JWT 기반 사용자 상태 초기화 함수
async function initializeUserState() {
  try {
    const userProfile = await getUserProfile();
    return {
      isAuthenticated: true,
      user: userProfile,
      isAdmin: userProfile.is_admin || false,
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error.message);
    return {
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    };
  }
}

customElements.define("header-component", HeaderComponent);

export default HeaderComponent;

import { getUserProfile } from "../../services/userService.js";
import { getCartItems } from "../../services/cartService.js";

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

    const token = localStorage.getItem("access_token");
    const isLoggedIn = Boolean(token);

    let profileLink = "/user/login.html";
    let cartLink = "/user/login.html";
    let userName = "로그인";
    let cartItemCount = 0;

    if (isLoggedIn) {
      try {
        const user = await getUserProfile();
        userName = user?.username || "사용자";

        const cartItems = await getCartItems();
        cartItemCount = cartItems.length;
        profileLink = "/user/profile.html";
        cartLink = "/Cart/cart.html";
      } catch (error) {
        console.error("Error loading user or cart data:", error.message);
      }
    }

    this.renderHeader(
      menuItems,
      profileLink,
      cartLink,
      isLoggedIn,
      userName,
      cartItemCount
    );
    this.addHamburgerMenuListeners();
    this.addScrollListener();
  }

  renderHeader(
    menuItems,
    profileLink,
    cartLink,
    isLoggedIn,
    userName,
    cartItemCount
  ) {
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
              isLoggedIn
                ? `
                  <a class="user-icon" href="${profileLink}">
                    <i class="fa-regular fa-user"></i>
                    <span class="user-name" style="font-size:14px; white-space:nowrap;">${userName}님</span>
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
                ` /* 비로그인 시 아무것도 표시하지 않음 */
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
            ${isLoggedIn ? `Profile (${userName})` : "Login"}
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

customElements.define("header-component", HeaderComponent);

export default HeaderComponent;

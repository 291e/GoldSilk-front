import { fetchUserProfile, logoutUser } from "../app/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameElement = document
    .getElementById("username")
    .querySelector("span");
  const emailElement = document.getElementById("email").querySelector("span");
  const logoutButton = document.getElementById("logout-button");

  try {
    // 사용자 프로필 데이터 가져오기
    const userProfile = await fetchUserProfile();

    if (userProfile) {
      usernameElement.textContent = userProfile.username;
      emailElement.textContent = userProfile.email;
    } else {
      alert("사용자 정보를 불러오지 못했습니다.");
      window.location.href = "/user/login.html"; // 로그인 페이지로 리다이렉트
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    alert("로그인이 필요합니다.");
    window.location.href = "/user/login.html"; // 로그인 페이지로 리다이렉트
  }

  // 로그아웃 버튼 이벤트 추가
  logoutButton.addEventListener("click", () => {
    logoutUser();
    alert("로그아웃 되었습니다.");
    window.location.href = "/"; // 로그인 페이지로 리다이렉트
  });
});

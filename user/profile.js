import { getUserProfile, logoutUser } from "../../services/userService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameElement = document
    .getElementById("username")
    ?.querySelector("span");
  const emailElement = document.getElementById("email")?.querySelector("span");
  const logoutButton = document.getElementById("logout-button");
  const profileMessage = document.getElementById("profileMessage");

  try {
    // 로딩 상태 메시지
    if (profileMessage) {
      profileMessage.textContent = "사용자 정보를 불러오는 중입니다...";
    }

    // 사용자 프로필 데이터 가져오기
    const userProfile = await getUserProfile();

    if (userProfile) {
      if (usernameElement) {
        usernameElement.textContent = userProfile.username || "Unknown";
      }
      if (emailElement) {
        emailElement.textContent = userProfile.email || "Unknown";
      }
      if (profileMessage) {
        profileMessage.textContent = ""; // 로딩 메시지 제거
      }
    } else {
      if (profileMessage) {
        profileMessage.textContent = "사용자 정보를 불러오지 못했습니다.";
      }
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);

    // 에러 메시지 표시 및 리다이렉트
    if (profileMessage) {
      profileMessage.textContent =
        error.message || "사용자 정보를 불러오는 중 오류가 발생했습니다.";
    }
    setTimeout(() => {
      window.location.href = "/user/login.html"; // 로그인 페이지로 리다이렉트
    }, 2000);
  }

  // 로그아웃 버튼 이벤트 추가
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (confirm("로그아웃 하시겠습니까?")) {
        logoutUser();
        alert("로그아웃 되었습니다.");
        window.location.href = "/"; // 메인 페이지로 리다이렉트
      }
    });
  }
});

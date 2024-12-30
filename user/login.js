import { loginUser, fetchUserProfile } from "../app/auth.js";

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const rememberMe = document.getElementById("rememberMe");
  const loginEmail = document.getElementById("loginEmail");

  // 로컬 스토리지에서 아이디 불러오기
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    loginEmail.value = savedEmail; // 저장된 이메일이 있으면 입력 필드에 자동 입력
    rememberMe.checked = true; // 체크박스 체크 상태 유지
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const email = loginEmail.value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      loginMessage.innerText = "이메일과 비밀번호를 모두 입력해주세요.";
      return;
    }

    try {
      // 로그인 요청
      const result = await loginUser({ email, password });

      if (result) {
        loginMessage.innerText = "로그인 성공! 메인 페이지로 이동합니다.";

        // 아이디 저장 여부 확인
        if (rememberMe.checked) {
          localStorage.setItem("savedEmail", email); // 아이디 저장
        } else {
          localStorage.removeItem("savedEmail"); // 체크 해제 시 저장된 아이디 삭제
        }

        // 로그인 성공 시 프로필 정보 확인
        const userProfile = await fetchUserProfile();
        if (userProfile) {
          console.log("User Profile:", userProfile);
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        loginMessage.innerText =
          "로그인 실패! 이메일 또는 비밀번호를 확인해주세요.";
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      loginMessage.innerText = "로그인 실패! 서버 오류가 발생했습니다.";
    }
  });
});

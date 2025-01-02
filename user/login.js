import { loginUser } from "../../services/userService.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const rememberMe = document.getElementById("rememberMe");
  const loginEmail = document.getElementById("loginEmail");

  // 로컬 스토리지에서 저장된 이메일 불러오기
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    loginEmail.value = savedEmail; // 저장된 이메일이 있으면 입력 필드에 자동 입력
    rememberMe.checked = true; // 체크박스 체크 상태 유지
  }

  // 토큰 만료 확인 및 삭제
  function checkTokenExpiration() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // JWT Payload 디코딩
      const expirationTime = tokenPayload.exp * 1000; // 만료 시간 (밀리초)

      if (Date.now() >= expirationTime) {
        // 만료되었으면 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("savedEmail");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
      } else {
        // 만료 시간까지 남은 시간 계산
        const timeUntilExpiration = expirationTime - Date.now();
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("savedEmail");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login.html"; // 로그인 페이지로 리다이렉트
        }, timeUntilExpiration);
      }
    }
  }

  // 페이지 로드 시 토큰 만료 확인
  checkTokenExpiration();

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const email = loginEmail.value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      loginMessage.innerText = "이메일과 비밀번호를 모두 입력해주세요.";
      return;
    }

    loginMessage.innerText = "로그인 진행 중..."; // 로딩 상태 메시지 표시

    try {
      // 로그인 요청
      const { token } = await loginUser({ email, password });

      if (token) {
        loginMessage.innerText = "로그인 성공! 메인 페이지로 이동합니다.";

        // 토큰 저장
        localStorage.setItem("accessToken", token);

        // 아이디 저장 여부 확인
        if (rememberMe.checked) {
          localStorage.setItem("savedEmail", email); // 아이디 저장
        } else {
          localStorage.removeItem("savedEmail"); // 체크 해제 시 저장된 아이디 삭제
        }

        // 토큰 만료 시간 확인 및 만료 예약
        checkTokenExpiration();

        // 메인 페이지로 이동
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        loginMessage.innerText =
          "로그인 실패! 이메일 또는 비밀번호를 확인해주세요.";
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      loginMessage.innerText =
        error.message || "로그인 실패! 서버 오류가 발생했습니다.";
    }
  });
});

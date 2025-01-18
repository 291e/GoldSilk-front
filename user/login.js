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

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const email = loginEmail.value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // 기본 검증
    if (!email || !password) {
      loginMessage.innerText = "이메일과 비밀번호를 모두 입력해주세요.";
      loginMessage.style.color = "red";
      return;
    }

    loginMessage.innerText = "로그인 진행 중...";
    loginMessage.style.color = "black"; // 진행 중일 때 메시지 색상

    try {
      // 로그인 요청
      const user = await loginUser({ email, password });

      if (user) {
        loginMessage.innerText = "로그인 성공! 메인 페이지로 이동합니다.";
        loginMessage.style.color = "green";

        // 아이디 저장 여부 확인
        if (rememberMe.checked) {
          localStorage.setItem("savedEmail", email); // 이메일 저장
        } else {
          localStorage.removeItem("savedEmail"); // 체크 해제 시 저장된 이메일 삭제
        }

        // 메인 페이지로 이동
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        loginMessage.innerText =
          "로그인 실패! 이메일 또는 비밀번호를 확인해주세요.";
        loginMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      loginMessage.innerText =
        error.message || "로그인 실패! 서버 오류가 발생했습니다.";
      loginMessage.style.color = "red";

      // 서버 오류 시 리프레시 토큰 처리 (예: 토큰 갱신)
      if (error.message === "유효하지 않은 토큰입니다.") {
        // TODO: 필요 시 refreshAccessToken 호출 추가
      }
    }
  });
});

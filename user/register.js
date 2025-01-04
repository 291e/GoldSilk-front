import { registerUser, checkEmailDuplicate } from "../services/userService.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  const emailInput = document.getElementById("registerEmail");
  const checkEmailBtn = document.getElementById("checkEmailBtn");
  const passwordInput = document.getElementById("registerPassword");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const passwordInfo = document.getElementById("passwordInfo");

  const agreeAllCheckbox = document.getElementById("agreeAll");
  const termsCheckbox = document.getElementById("terms");
  const privacyCheckbox = document.getElementById("privacy");
  const allCheckboxes = [termsCheckbox, privacyCheckbox];

  // "전체 동의" 체크박스 이벤트 리스너
  agreeAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    allCheckboxes.forEach((checkbox) => (checkbox.checked = isChecked));
  });

  // 개별 체크박스 이벤트 리스너
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      agreeAllCheckbox.checked = allCheckboxes.every((cb) => cb.checked);
    });
  });

  // 비밀번호 유효성 검사
  function isValidPassword(password) {
    return password.length >= 4; // 최소 4자리
  }

  // 이메일 중복 확인
  async function validateEmail(email) {
    if (!email) {
      emailError.textContent = "이메일을 입력해주세요.";
      emailError.style.display = "block";
      return false;
    }

    try {
      const { isDuplicate, message } = await checkEmailDuplicate(email);
      if (isDuplicate) {
        emailError.textContent = message; // "이미 사용 중인 이메일입니다."
        emailError.style.display = "block";
        emailError.style.color = ""; // 기본 에러 스타일
        return false;
      }
      emailError.textContent = message; // "사용 가능한 이메일입니다."
      emailError.style.display = "block";
      emailError.style.color = "green"; // 성공 메시지 스타일
      return true;
    } catch (error) {
      emailError.textContent = "중복된 이메일입니다.";
      emailError.style.display = "block";
      emailError.style.color = ""; // 기본 에러 스타일
      return false;
    }
  }

  // 이메일 중복 확인 버튼 이벤트
  checkEmailBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    await validateEmail(email);
  });

  // 폼 제출 이벤트
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const phonePart1 = document.getElementById("phonePart1").value.trim();
    const phonePart2 = document.getElementById("phonePart2").value.trim();
    const phonePart3 = document.getElementById("phonePart3").value.trim();
    const phone = `${phonePart1}-${phonePart2}-${phonePart3}`;

    // 필수 체크박스 확인
    if (!termsCheckbox.checked || !privacyCheckbox.checked) {
      registerMessage.innerText = "필수 항목에 동의해주세요.";
      return;
    }

    // 비밀번호 유효성 검사
    if (!isValidPassword(password)) {
      passwordError.textContent = "비밀번호는 4자리 이상이어야 합니다.";
      passwordError.style.display = "block";
      passwordInfo.style.display = "none";
      return;
    }
    passwordError.textContent = "";
    passwordError.style.display = "none";
    passwordInfo.style.display = "block";

    // 이메일 중복 확인
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      return;
    }

    try {
      registerMessage.innerText = "회원가입 진행 중...";
      const result = await registerUser({ username, email, password, phone });

      if (result) {
        registerMessage.innerText = "회원가입이 완료되었습니다.";
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (error) {
      registerMessage.innerText =
        error.message || "회원가입 중 오류가 발생했습니다.";
    }
  });
});

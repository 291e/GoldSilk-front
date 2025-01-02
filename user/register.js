import { registerUser, loginUser } from "../services/userService.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  // 체크박스 요소 가져오기
  const agreeAllCheckbox = document.getElementById("agreeAll");
  const termsCheckbox = document.getElementById("terms");
  const privacyCheckbox = document.getElementById("privacy");
  const marketingCheckbox = document.getElementById("marketing");
  const marketingCheckbox2 = document.getElementById("marketing2");

  const allCheckboxes = [
    termsCheckbox,
    privacyCheckbox,
    marketingCheckbox,
    marketingCheckbox2,
  ];

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

  // 필수 체크박스 검사
  function areRequiredCheckboxesChecked() {
    return termsCheckbox.checked && privacyCheckbox.checked;
  }

  // 휴대전화 유효성 검사
  function isValidPhone(phonePart2, phonePart3) {
    const phoneRegex = /^\d{4}$/;
    return phoneRegex.test(phonePart2) && phoneRegex.test(phonePart3);
  }

  // 비밀번호 유효성 검사
  function isValidPassword(password) {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
  }

  // 회원가입 처리
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const phonePart1 = document.getElementById("phonePart1").value.trim();
    const phonePart2 = document.getElementById("phonePart2").value.trim();
    const phonePart3 = document.getElementById("phonePart3").value.trim();

    const phone = `${phonePart1}-${phonePart2}-${phonePart3}`;

    console.log("Form Data:", { username, email, password, phone });

    if (!areRequiredCheckboxesChecked()) {
      registerMessage.innerText = "필수 항목에 동의해주세요.";
      return;
    }

    try {
      registerMessage.innerText = "회원가입 진행 중...";
      const result = await registerUser({ username, email, password, phone });
      console.log("Registration Success:", result);

      if (result) {
        registerMessage.innerText = "회원가입이 완료되었습니다.";
        const loginResult = await loginUser({ email, password });
        if (loginResult) {
          registerMessage.innerText = "회원가입 및 로그인 성공!";
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Registration Error:", error.message);
      registerMessage.innerText =
        error.message || "회원가입 중 오류가 발생했습니다.";
    }
  });
});

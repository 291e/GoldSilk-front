import { registerUser, loginUser } from "../api/auth.js";

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

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 가져오기
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const phonePart1 = document.getElementById("phonePart1").value.trim();
    const phonePart2 = document.getElementById("phonePart2").value.trim();
    const phonePart3 = document.getElementById("phonePart3").value.trim();

    // 필수 체크박스 확인
    if (!areRequiredCheckboxesChecked()) {
      registerMessage.innerText =
        "필수 항목에 모두 동의해야 회원가입이 가능합니다.";
      return;
    }

    // 휴대전화 유효성 검사 (4자리 숫자)
    const phoneRegex = /^\d{4}$/;
    if (!phoneRegex.test(phonePart2) || !phoneRegex.test(phonePart3)) {
      registerMessage.innerText = "휴대전화는 4자리 숫자만 입력해주세요.";
      return;
    }

    // 최종 휴대전화 번호 조합
    const phone = `${phonePart1}-${phonePart2}-${phonePart3}`;

    // 비밀번호 유효성 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      registerMessage.innerText =
        "비밀번호는 8자 이상, 영문+숫자+특수문자 조합이어야 합니다.";
      return;
    }

    try {
      // 회원가입 요청
      const result = await registerUser({
        username,
        email,
        password,
        phone,
      });

      if (result) {
        registerMessage.innerText = "회원가입이 성공적으로 완료되었습니다!";

        // 자동 로그인 시도
        const loginResult = await loginUser({ email, password });
        if (loginResult) {
          localStorage.setItem("access_token", loginResult.access_token);
          localStorage.setItem("refresh_token", loginResult.refresh_token);

          registerMessage.innerText =
            "회원가입 및 자동 로그인 성공! 메인 페이지로 이동합니다.";
          setTimeout(() => {
            window.location.href = "http://goldsilk.metashopping.kr/goldGroup/";
          }, 1000);
        } else {
          registerMessage.innerText =
            "회원가입은 성공했지만 자동 로그인에 실패했습니다.";
        }
      } else {
        registerMessage.innerText =
          "회원가입에 실패했습니다. 다시 시도해주세요.";
      }
    } catch (error) {
      console.error("Error during registration and login:", error.message);
      registerMessage.innerText = "오류가 발생했습니다. 다시 시도해주세요.";
    }
  });
});

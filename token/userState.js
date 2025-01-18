// userState.js
import {
  refreshAccessToken,
  getUserProfile,
  logoutUser,
} from "../services/userService.js";

let userState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
};

export async function initializeUserState() {
  try {
    // 토큰 갱신 및 유저 정보 가져오기
    await refreshAccessToken();
    const user = await getUserProfile();

    userState = {
      isAuthenticated: true,
      user: user,
      isAdmin: user?.is_admin || false,
    };
  } catch (error) {
    console.error("User state initialization failed:", error.message);
    logoutUser(); // 로그아웃 처리
    userState = {
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    };
  }
}

export function getUserState() {
  return userState;
}

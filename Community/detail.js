import { getCommunityPosts } from "../services/communityService.js";
import {
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
} from "../services/adminService.js";
import { getUserProfile } from "../services/userService.js";

// 상태 변수
let currentPage = 1;
const postsPerPage = 10;
let posts = [];
let isAdmin = false; // 관리자인지 확인
let isEditMode = false; // 편집 모드 상태

// DOM 요소
const postList = document.getElementById("post-list");
const pagination = document.querySelector(".pagination-community");
const pageTitle = document.getElementById("page-title");
const container = document.querySelector(".community-detail");

// URL에서 `type` 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postType = urlParams.get("type") || "notice"; // 기본값: 공지사항

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 유효한 postType만 허용
    const validPostTypes = ["notice", "events", "branches", "articles"];
    const validatedType = validPostTypes.includes(postType)
      ? postType
      : "notice";

    isAdmin = checkAdmin(); // 관리자인지 확인
    pageTitle.textContent = getPageTitle(validatedType); // 페이지 제목 설정

    if (isAdmin) {
      addAdminControls();
    }

    // 해당 타입의 게시글 가져오기
    posts = await getCommunityPosts(validatedType);

    // 데이터 유효성 확인
    if (!Array.isArray(posts)) {
      throw new Error("Invalid posts data format");
    }

    // 최신순 정렬
    posts = posts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    renderPosts();
    renderPagination();
  } catch (error) {
    console.error("Error loading posts:", error.message);
    if (postList) {
      postList.innerHTML = `<tr><td colspan="5">게시글을 불러오는 데 실패했습니다.</td></tr>`;
    }
  }
});

// 페이지 제목 설정
function getPageTitle(type) {
  const titles = {
    notice: "공지사항",
    events: "이벤트 & 프로모션",
    branches: "체인점 안내",
    articles: "황금단 기사",
  };
  return titles[type] || "커뮤니티";
}

// 관리자 여부 확인 (로컬 스토리지에서)
function checkAdmin() {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
    return payload.is_admin || false;
  } catch {
    return false;
  }
}

// 관리자 버튼 추가
function addAdminControls() {
  const adminButton = document.createElement("i");
  adminButton.className = "fa-solid fa-gear admin-icon";
  adminButton.title = "편집 모드";
  adminButton.style.cursor = "pointer";
  pageTitle.appendChild(adminButton);

  adminButton.addEventListener("click", toggleEditMode);
}

// 편집 모드 토글
function toggleEditMode() {
  isEditMode = !isEditMode;
  container.classList.toggle("edit-mode", isEditMode);

  if (isEditMode) {
    showAdminOptions();
  } else {
    removeAdminOptions();
  }
}

// 관리자 옵션 표시
function showAdminOptions() {
  const adminControls = document.createElement("div");
  adminControls.className = "admin-controls";

  adminControls.innerHTML = `
      <button id="create-post">게시물 작성</button>
    `;
  container.prepend(adminControls);

  // 게시물 작성 버튼 클릭 이벤트
  document
    .getElementById("create-post")
    .addEventListener("click", showCreateModal);
}

// 관리자 옵션 제거
function removeAdminOptions() {
  const adminControls = document.querySelector(".admin-controls");
  if (adminControls) adminControls.remove();
}

// 게시물 작성 모달 표시
function showCreateModal() {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
              <div class="modal-content">
                <h2>게시물 작성</h2>
                <form id="create-form">
                  <input type="text" id="post-title" placeholder="제목" required />
                  <textarea id="post-content" placeholder="내용" required></textarea>
                  <button type="submit">저장</button>
                  <button type="button" id="close-modal">닫기</button>
                </form>
              </div>
            `;
  document.body.appendChild(modal);

  const closeModal = () => {
    document
      .getElementById("create-form")
      .removeEventListener("submit", handleSubmit);
    modal.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    try {
      const user = await getUserProfile(); // 유저 정보 가져오기
      const postData = {
        title,
        content,
        type: postType,
        status: "active",
        user_id: user.user_id, // 서버에서 가져온 유저 ID 포함
      };

      const newPost = await createCommunityPost(postData);
      posts.unshift(newPost);
      renderPosts();
      renderPagination();
      closeModal();
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  document
    .getElementById("create-form")
    .addEventListener("submit", handleSubmit);
  document.getElementById("close-modal").addEventListener("click", closeModal);
}

// 게시글 렌더링
function renderPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = posts.slice(start, end);

  postList.innerHTML = currentPosts
    .map(
      (post, index) => `
            <div class="community-content">
              <span>${start + index + 1}</span>
              
                <span>
                  <a href="/postDetail.html?community_id=${
                    post.community_id
                  }&type=${postType}">
                    ${post.title}
                  </a>
                  ${
                    isEditMode
                      ? `
                        <div class="post-actions">
                          <button class="edit-post" data-id="${post.community_id}">수정</button>
                          <button class="delete-post" data-id="${post.community_id}">삭제</button>
                        </div>`
                      : ""
                  }
                </span>
              
              <span>${post.user || "관리자"}</span>
              <span>${formatDate(post.created_at)}</span>
              <span>${post.views || 0}</span>
            </div>
          `
    )
    .join("");

  if (currentPosts.length === 0) {
    postList.innerHTML = `<div><span>게시글이 없습니다.</span></div>`;
  }

  if (isEditMode) {
    document.querySelectorAll(".edit-post").forEach((button) => {
      button.addEventListener("click", showEditModal);
    });
    document.querySelectorAll(".delete-post").forEach((button) => {
      button.addEventListener("click", deletePost);
    });
  }
}

// 페이지네이션 렌더링
function renderPagination() {
  const totalPages = Math.ceil(posts.length / postsPerPage);

  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} data-page="1"><<</button>
    <button ${currentPage === 1 ? "disabled" : ""} data-page="${
    currentPage - 1
  }"><</button>
    ${Array.from(
      { length: totalPages },
      (_, i) =>
        `<button class="${currentPage === i + 1 ? "active" : ""}" data-page="${
          i + 1
        }">${i + 1}</button>`
    ).join("")}
    <button ${currentPage === totalPages ? "disabled" : ""} data-page="${
    currentPage + 1
  }">></button>
    <button ${
      currentPage === totalPages ? "disabled" : ""
    } data-page="${totalPages}">>></button>
  `;

  pagination.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const page = parseInt(e.target.dataset.page, 10);
      if (page !== currentPage) {
        currentPage = page;
        renderPosts();
        renderPagination();
      }
    });
  });
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

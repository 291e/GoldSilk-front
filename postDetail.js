import { getCommunityPostById } from "/services/communityService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const pageTitleElement = document.getElementById("page-title");
  const postTitleElement = document.getElementById("post-title");
  const postAuthorElement = document.getElementById("post-author");
  const postDateElement = document.getElementById("post-date");
  const postViewsElement = document.getElementById("post-views");
  const postContentElement = document.getElementById("post-content");
  const commentListElement = document.getElementById("comment-list");
  const nextPostLinkElement = document.getElementById("next-post-link");
  const prevPostLinkElement = document.getElementById("prev-post-link");
  const backToListButton = document.getElementById("back-to-list");

  // URL에서 community_id 추출
  const params = new URLSearchParams(window.location.search);
  const communityId = params.get("community_id");

  if (!communityId || isNaN(Number(communityId))) {
    postContentElement.innerHTML = `<p>잘못된 접근입니다. 게시물 ID가 유효하지 않습니다.</p>`;
    return;
  }

  try {
    // 특정 게시물 가져오기
    const { post, prevPost, nextPost } = await getCommunityPostById(
      communityId
    );

    // 타입별 제목 결정
    const typeTitles = {
      notice: "공지사항",
      events: "이벤트 & 프로모션",
      branches: "체인점 안내",
      articles: "황금단 기사",
    };

    // 게시물 상세 정보 렌더링
    pageTitleElement.textContent = typeTitles[post.type] || "커뮤니티";
    postTitleElement.textContent = post.title || "제목 없음";
    postAuthorElement.textContent = post.author || "관리자";
    postDateElement.textContent = formatDate(post.created_at);
    postViewsElement.textContent = post.view_count || 0;
    postContentElement.innerHTML = post.content
      ? `<p>${post.content}</p>`
      : `<p>내용이 없습니다.</p>`;

    // 댓글 데이터 렌더링
    renderComments(post.comments || []);

    // 이전 게시글 렌더링
    if (prevPost) {
      prevPostLinkElement.textContent =
        `이전글 ${prevPost.title}` || "이전 글이 없습니다.";
      prevPostLinkElement.href = `/postDetail.html?community_id=${prevPost.community_id}`;
    } else {
      prevPostLinkElement.style.display = "none";
      prevPostLinkElement.href = "#";
    }

    // 다음 게시글 렌더링
    if (nextPost) {
      nextPostLinkElement.textContent =
        `다음글 ${nextPost.title}` || "다음 글이 없습니다.";
      nextPostLinkElement.href = `/postDetail.html?community_id=${nextPost.community_id}`;
    } else {
      nextPostLinkElement.style.display = "none";
      nextPostLinkElement.href = "#";
    }
  } catch (error) {
    console.error("Error fetching community post:", error.message);
    postContentElement.innerHTML = `<p>게시물을 불러오는 데 실패했습니다.</p>`;
  }

  // 목록 버튼 이벤트 추가
  backToListButton.addEventListener("click", () => {
    window.location.href = "/Community/community.html";
  });
});

// 댓글 렌더링 함수
function renderComments(comments) {
  const commentListElement = document.getElementById("comment-list");
  if (!comments.length) {
    commentListElement.innerHTML = `<tr><td colspan="4">댓글이 없습니다.</td></tr>`;
    return;
  }

  commentListElement.innerHTML = comments
    .map(
      (comment) => `
        <tr>
          <td>${comment.author || "익명"}</td>
          <td>${formatDate(comment.created_at)}</td>
          <td>${comment.rating || "-"}</td>
          <td>${comment.content || "내용 없음"}</td>
        </tr>
      `
    )
    .join("");
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

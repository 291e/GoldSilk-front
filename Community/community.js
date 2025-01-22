import { getCommunityPosts } from "../services/communityService.js";
import { getReviewsByProduct } from "../services/reviewService.js";

document.addEventListener("DOMContentLoaded", async () => {
  const communityContainer = document.querySelector(".community-container");

  // 카테고리 데이터 정의
  const categories = [
    {
      name: "공지사항",
      link: "/Community/notice.html?type=notice",
      type: "notice",
    },
    {
      name: "이벤트 & 프로모션",
      link: "/Community/events.html?type=events",
      type: "events",
    },
    {
      name: "체인점 안내",
      link: "/Community/branches.html?type=branches",
      type: "branches",
    },
    {
      name: "황금단 기사",
      link: "/Community/articles.html?type=articles",
      type: "articles",
    },
  ];

  try {
    for (const category of categories) {
      // 카테고리별 게시글 데이터 가져오기
      let posts = await getCommunityPosts(category.type);

      // 최신 순으로 정렬
      posts = posts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const postHTML = generatePostLayout(category, posts);
      communityContainer.innerHTML += postHTML;
    }

    // 고객후기 섹션 추가
    const reviewsHTML = await renderReviews();
    communityContainer.innerHTML += reviewsHTML;

    // 게시물 클릭 이벤트 추가
    addPostClickEvents();
  } catch (error) {
    console.error("Error loading community content:", error.message);
    communityContainer.innerHTML = `<p>커뮤니티 데이터를 불러오는 데 실패했습니다.</p>`;
  }
});

// 일반 게시글 레이아웃 생성
function generatePostLayout(category, posts) {
  const postItems = posts
    .slice(0, 5) // 최신 5개 제한
    .map(
      (post) => `
        <div class="post-header">
          <div class="post-title-wrapper" data-id="${
            post.community_id
          }" data-type="${category.type}">
            <span class="post-title" title="${post.title}">
              ${post.title || "게시글 제목"}
            </span>
            <span>${formatDate(post.created_at)}</span>
          </div>
        </div>
      `
    )
    .join("");

  return `
      <div class="post-container">
        <div class="post-layout">
          <div class="post-header">
            <span>${category.name}</span>
            <a href="${category.link}">더보기 +</a>
          </div>
          <div class="post-line"></div>
          <div class="post-text" style="min-height: 300px;">
            ${postItems || `<span class="no-posts">게시글이 없습니다.</span>`}
          </div>
          <div class="post-line"></div>
        </div>
      </div>
    `;
}

// 게시물 클릭 이벤트 추가
function addPostClickEvents() {
  const postElements = document.querySelectorAll(".post-title-wrapper");
  postElements.forEach((postElement) => {
    postElement.addEventListener("click", (e) => {
      const communityId = postElement.dataset.id;
      const communityType = postElement.dataset.type;
      if (communityId) {
        window.location.href = `/postDetail.html?community_id=${communityId}&type=${communityType}`;
      }
    });
  });
}

// 고객후기 섹션 렌더링
async function renderReviews() {
  try {
    return `
        <div class="post-container">
          <div class="post-layout">
            <div class="post-header">
              <span>고객후기</span>
              <a href="/Community/reviews.html">더보기 +</a>
            </div>
            <div class="post-line"></div>
            <div id="reviews-section"></div>
            <div class="post-line"></div>
          </div>
        </div>
      `;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return `<p>고객후기 데이터를 불러오는 데 실패했습니다.</p>`;
  }
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

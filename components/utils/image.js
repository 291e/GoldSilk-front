export async function formatImagePath(imagePath) {
  if (!imagePath) {
    return "placeholder.jpg"; // 기본 이미지 경로 반환
  }

  const baseURL = "https://goldsilk.net"; // 서버의 base URL

  // 이미지 경로에 /images/가 포함되지 않으면 경로를 추가
  if (!imagePath.includes("/images/")) {
    imagePath = `/images${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  }

  const fullURL = `${baseURL}${imagePath}`; // 최종 이미지 URL

  try {
    const response = await fetch(fullURL, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Failed to load image:", fullURL);
      return "placeholder.jpg"; // 실패시 기본 이미지 반환
    }

    // Blob 데이터를 URL 객체로 변환하여 반환
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching image:", error);
    return "placeholder.jpg"; // 오류 발생 시 기본 이미지 반환
  }
}

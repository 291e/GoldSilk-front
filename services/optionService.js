export async function fetchProductOptions(productId) {
  try {
    const response = await fetch(`https://goldsilk.net/options/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product options");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product options:", error);
    throw error;
  }
}

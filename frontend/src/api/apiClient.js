const BASE_URL = "http://localhost:5001/api";


export const fetchCatalog = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/catalog`);
    const result = await response.json();
    return result.data; // Return just the data array
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
};
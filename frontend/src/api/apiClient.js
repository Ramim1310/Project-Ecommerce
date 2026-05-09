const BASE_URL = "http://localhost:5001/api";


export const fetchCatalog = async (filters = {}) => {
  try {
    // 1. Convert the filters object into a URL search string
    // e.g. { brand: 'Logitech' } -> 'brand=Logitech'
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${BASE_URL}/products/catalog${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
};
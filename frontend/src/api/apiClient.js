const BASE_URL = "http://localhost:5001/api";


export const fetchCatalog = async (filters = {}) => {
  try {
    //  Convert the filters object into a URL search string
    
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${BASE_URL}/products/catalog${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const result = await response.json();
    return { data: result.data, pagination: result.pagination };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { data: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 1 } };
  }
};
export async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
}

export async function fetchDailyMenu(id, lang = "en") {
  try {
    const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/${lang}`);
    if (!response.ok) {
      throw new Error(`No menu available for this restaurant.`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Menu fetch failed: ${error.message}`);
    return null; // Return null if the menu fetch fails
  }
}

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

export async function checkUserNameAvailability(userName) {
  try {
    const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${userName}`);
    if (!response.ok) {
      throw new Error(`User not found.`);
    }
    return await response;
  } catch (error) {
    console.warn(`User check failed: ${error.message}`);
    return null;
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`User creation failed.`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`User creation failed: ${error.message}`);
    return null;
  }
}

export async function userLogin(userData) {
  try {
    const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`Login failed.`);
    }
    if (response.statusCode === 200) {
      localStorage.setItem('token', response.token);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Login failed: ${error.message}`);
    return null;
  }
}

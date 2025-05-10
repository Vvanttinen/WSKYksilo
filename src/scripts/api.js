export async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    data.statusCode = response.status;
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
    const response = await fetchData(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${userName}`);
    if (response.statusCode === 200) {
      return response.available;
    } else {
      throw new Error(`User name check failed.`);
    }
  } catch (error) {
    console.warn(`User check failed: ${error.message}`);
    return null;
  }
}

export async function createUser(userData) {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
    const registerResult = await fetchData('https://media2.edu.metropolia.fi/restaurant/api/v1/users', fetchOptions);
    console.log(registerResult.activationUrl);
    return registerResult.data;
  } catch (error) {
    console.warn(`User creation failed: ${error.message}`);
    return null;
  }
}

export async function userLogin(userData) {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
    const loginResult = await fetchData("https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login", fetchOptions);
    if (loginResult.statusCode === 200) {
      localStorage.setItem('token', loginResult.token);
    }
    return loginResult.data;
  } catch (error) {
    console.warn(`Login failed: ${error.message}`);
    return null;
  }
}

export async function updateUser(userData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
      body: JSON.stringify(userData),
    }
    const updateUserResult = await fetchData("https://media2.edu.metropolia.fi/restaurant/api/v1/users", fetchOptions);
    if (updateUserResult.statusCode === 200) {
      return updateUserResult.data;
    }
    return null;
  } catch (error) {
    console.warn(`User update failed: ${error.message}`);
    return null;
  }
}

export async function getUserByToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
    }
    const userResult = await fetchData("https://media2.edu.metropolia.fi/restaurant/api/v1/users/token", fetchOptions);
    return userResult;
  } catch (error) {
    console.warn(`User fetch failed: ${error.message}`);
    return null;
  }
}

export async function uploadAvatar(file) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const formData = new FormData();
    formData.append('avatar', file);

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer: ${token}`,
      },
      mode: 'cors',
      body: formData,
    }
    const uploadResult = await fetchData("https://media2.edu.metropolia.fi/restaurant/api/v1/users/avatar", fetchOptions);
    return uploadResult;
  } catch (error) {
    console.warn(`Avatar upload failed: ${error.message}`);
    return null;
  }
}

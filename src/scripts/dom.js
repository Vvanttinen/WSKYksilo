import {fetchDailyMenu, getUserByToken} from './api.js';
import {createAuthDialog, handleLogout, openAuthDialog} from './auth.js';
import { setCurrentUser, createProfileDialog, openProfileDialog } from './profile.js';

export async function setupPage() {
  document.body.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Restaurants';
  heading.className = 'main-heading';
  document.body.appendChild(heading);

  const user = await getUserByToken();
  if (user) {
    setCurrentUser(user);
  }

  // Create profile dropdown (ALWAYS includes all items, show/hide with CSS)
  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'avatar-wrapper';

  const avatarImg = document.createElement('img');
  avatarImg.className = 'avatar-img';
  avatarWrapper.appendChild(avatarImg);

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'dropdown-menu';
  dropdownMenu.style.display = 'none';

  const profileOption = document.createElement('div');
  profileOption.textContent = 'Profile';
  profileOption.id = 'profile-option';
  profileOption.classList.add('profile-option');
  profileOption.addEventListener('click', () => {
    openProfileDialog(user);
    dropdownMenu.style.display = 'none';
  });

  const logoutOption = document.createElement('div');
  logoutOption.textContent = 'Logout';
  logoutOption.id = 'logout-option';
  logoutOption.addEventListener('click', () => {
    handleLogout();
  });

  const loginOption = document.createElement('div');
  loginOption.textContent = 'Login / Register';
  loginOption.id = 'login-option';
  loginOption.addEventListener('click', () => {
    openAuthDialog();
    dropdownMenu.style.display = 'none';
  });

  dropdownMenu.appendChild(profileOption);
  dropdownMenu.appendChild(logoutOption);
  dropdownMenu.appendChild(loginOption);

  avatarWrapper.appendChild(dropdownMenu);
  document.body.appendChild(avatarWrapper);

  // Toggle dropdown on avatar click
  avatarImg.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (!avatarWrapper.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });

  createProfileDialog();
  createAuthDialog();

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-wrapper';

  const searchIcon = document.createElement('img');
  searchIcon.src = 'assets/search.svg';
  searchIcon.alt = 'Search';
  searchIcon.className = 'search-icon';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search by name';
  searchInput.id = 'search-bar';

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);
  document.body.appendChild(searchWrapper);

  const main = document.createElement('main');
  main.className = 'page-container';
  document.body.appendChild(main);

  const leftColumn = document.createElement('div');
  leftColumn.className = 'left-column';
  main.appendChild(leftColumn);

  const listContainer = document.createElement('div');
  listContainer.className = 'restaurant-list';
  listContainer.id = 'restaurant-list';
  leftColumn.appendChild(listContainer);

  const menuPanel = document.createElement('div');
  menuPanel.className = 'menu-panel';
  menuPanel.id = 'menu-panel';
  main.appendChild(menuPanel);

  // Apply initial user state
  updateUserUI(user);
}
export function updateUserUI(user) {
  const avatarImg = document.querySelector('.avatar-img');
  const profileOption = document.getElementById('profile-option');
  const logoutOption = document.getElementById('logout-option');
  const loginOption = document.getElementById('login-option');

  if (user) {
    avatarImg.src = "https://media2.edu.metropolia.fi/restaurant/uploads/" + user.avatar || 'assets/default-avatar.png';
    profileOption.style.display = 'block';
    logoutOption.style.display = 'block';
    loginOption.style.display = 'none';
  } else {
    avatarImg.src = 'assets/default-avatar.png';
    profileOption.style.display = 'none';
    logoutOption.style.display = 'none';
    loginOption.style.display = 'block';
  }

  // Update avatar image in profile dialog
  const profileAvatar = document.getElementById('profile-avatar');
  if (profileAvatar) {
    profileAvatar.src = "https://media2.edu.metropolia.fi/restaurant/uploads/" + user.avatar || 'assets/default-avatar.png';
  }

  // Update display texts in profile dialog
  const usernameDisplay = document.getElementById('profile-username-display');
  const emailDisplay = document.getElementById('profile-email-display');
  if (usernameDisplay) {
    usernameDisplay.textContent = `Username: ${user.username}`;
  }
  if (emailDisplay) {
    emailDisplay.textContent = `Email: ${user.email}`;
  }

  // Update avatar image in top-right avatar
  const topAvatarImg = document.querySelector('.avatar-img');
  if (topAvatarImg) {
    topAvatarImg.src = "https://media2.edu.metropolia.fi/restaurant/uploads/" + user.avatar || 'assets/default-avatar.png';
  }

  // Update dropdown if you show username there
  const dropdownProfileOption = document.querySelector('.dropdown-menu .profile-option');
  if (dropdownProfileOption) {
    dropdownProfileOption.textContent = `Profile (${user.username})`;
  }
}

let allRestaurants = []; // Full list of restaurants
export function renderRestaurants(restaurants) {
  allRestaurants = restaurants;
  updateRestaurantList(restaurants);

  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allRestaurants.filter(r =>
      r.name.toLowerCase().includes(query)
    );
    updateRestaurantList(filtered);
  });
}

function updateRestaurantList(restaurants) {
  const list = document.getElementById('restaurant-list');
  list.innerHTML = ''; // Clear current list

  restaurants.sort((a, b) => a.name.localeCompare(b.name));
  restaurants.forEach((restaurant) => {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <h2>${restaurant.name}</h2>
      <p><strong>Address:</strong> ${restaurant.address}</p>
      <p><strong>Phone:</strong> ${restaurant.phone}</p>
      <p><strong>Company:</strong> ${restaurant.company}</p>
    `;
    card.addEventListener('click', () => {
      const allCards = document.querySelectorAll('.restaurant-card');
      allCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      renderMenu(restaurant);
    });

    list.appendChild(card);
  });
}

async function renderMenu(restaurant) {
  const menuPanel = document.querySelector('.menu-panel');

  /* Clear previous content */
  menuPanel.innerHTML = '';
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    menuPanel.classList.remove('active');
    const allCards = document.querySelectorAll('.restaurant-card');
    allCards.forEach(c => c.classList.remove('selected'));
  });
  menuPanel.appendChild(closeButton);

  /* Create a card for the restaurant */
  const menuCard = document.createElement('div');
  menuCard.className = 'menu-card';
  menuCard.innerHTML = `
    <h2>${restaurant.name}</h2>
    <p><strong>Address:</strong> ${restaurant.address}</p>
    <p><strong>Phone:</strong> ${restaurant.phone}</p>
    <p><strong>Company:</strong> ${restaurant.company}</p>
    <h3>Today's Menu</h3>
    <div class="menu-items">Loading menu...</div>
  `;
  menuPanel.appendChild(menuCard);

  menuPanel.classList.add('active');

  /* Fetch the daily menu */
  const menuData = await fetchDailyMenu(restaurant._id);
  const menuItemsContainer = menuCard.querySelector('.menu-items');

  if (!menuData || !menuData.courses || menuData.courses.length === 0) {
    menuItemsContainer.innerHTML = '<p>No menu available for today.</p>';
    return;
  }

  menuItemsContainer.innerHTML = '';

  menuData.courses.forEach((course) => {
    const courseEl = document.createElement('div');
    courseEl.className = 'menu-course';
    courseEl.innerHTML = `
      <p><strong>${course.name || 'Unnamed Dish'}</strong></p>
      <p>${course.price || 'No price listed'}</p>
      <p>${course.diets ? course.diets.join(', ') : ''}</p>
    `;
    menuItemsContainer.appendChild(courseEl);
  });
}

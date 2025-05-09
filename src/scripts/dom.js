import {fetchDailyMenu} from './api.js';
import { createAuthDialog, openAuthDialog } from './auth.js';

export function setupPage() {
  document.body.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Restaurants';
  heading.className = 'main-heading';
  document.body.appendChild(heading);

  const authButton = document.createElement('button');
  authButton.className = 'auth-button';
  authButton.textContent = 'Login';
  authButton.addEventListener('click', () => {
    openAuthDialog();
  });
  document.body.appendChild(authButton);

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
  menuPanel.innerHTML = '<p>Select a restaurant to see details here.</p>';
  main.appendChild(menuPanel);

  createAuthDialog();
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

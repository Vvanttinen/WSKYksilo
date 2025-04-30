export function setupPage() {
  document.body.innerHTML = '';

  const main = document.createElement('main');
  document.body.appendChild(main);

  const heading = document.createElement('h1');
  heading.textContent = 'Restaurants';
  main.appendChild(heading);

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
  main.appendChild(searchWrapper);

  const listContainer = document.createElement('div');
  listContainer.className = 'restaurant-list';
  listContainer.id = 'restaurant-list';
  main.appendChild(listContainer);
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
    console.log(restaurant);
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <h2>${restaurant.name}</h2>
      <p><strong>Address:</strong> ${restaurant.address}</p>
      <p><strong>Phone:</strong> ${restaurant.phone}</p>
      <p><strong>Company:</strong> ${restaurant.company}</p>
    `;
    list.appendChild(card);
  });
}

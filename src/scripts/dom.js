export function setupPage() {
  document.body.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Restaurants';
  document.body.appendChild(heading);

  const listContainer = document.createElement('div');
  listContainer.className = 'restaurant-list';
  listContainer.id = 'restaurant-list';
  document.body.appendChild(listContainer);
}

export function renderRestaurants(restaurants) {
  const list = document.getElementById('restaurant-list');
  restaurants.sort((a, b) => a.name.localeCompare(b.name));

  restaurants.forEach((restaurant) => {
    console.log(restaurant);
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <h2>${restaurant.name}</h2>
      <p><strong>Description:</strong> ${restaurant.description}</p>
      <p><strong>Address:</strong> ${restaurant.address}</p>
      <p><strong>Phone:</strong> ${restaurant.phone}</p>
      <p><strong>Company:</strong> ${restaurant.company}</p>
    `;
    list.appendChild(card);
  });
}

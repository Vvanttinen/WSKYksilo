import { fetchData } from './api.js';
import {renderRestaurants, setupPage} from './dom.js';

async function init() {
  try {
    setupPage();
    const restaurants = await fetchData("https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants");
    renderRestaurants(restaurants);
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

init();

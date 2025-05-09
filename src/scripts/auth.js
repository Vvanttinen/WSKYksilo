import {createUser, userLogin, checkUserNameAvailability} from './api.js';
import {getCurrentUser, setCurrentUser} from './profile.js';
import {updateUserUI} from './dom.js';

export function createAuthDialog() {
  const dialog = document.createElement('dialog');
  dialog.id = 'auth-dialog';
  dialog.innerHTML = getLoginForm(); // Start with login form
  document.body.appendChild(dialog);

  setupFormHandlers(dialog); // Attach events
}

export function openAuthDialog() {
  const authDialog = document.getElementById('auth-dialog');
  authDialog.showModal();
  resetForm();
}

function setupFormHandlers(dialog) {
  const loginButton = dialog.querySelector('#login-button');
  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      loginButton.textContent = 'Loading...';
      loginButton.disabled = true;
      const success = await handleLogin();
      if (success) {
        dialog.close();
        updateUserUI(getCurrentUser());
      }
      loginButton.textContent = 'Login';
      loginButton.disabled = false;
    });
  }

  const registerButton = dialog.querySelector('#register-button');
  if (registerButton) {
    registerButton.addEventListener('click', async () => {
      registerButton.disabled = true;
      registerButton.textContent = 'Loading...';
      const success = await handleRegister();
      if (success) {
        dialog.close();
        updateUserUI(getCurrentUser());
      }
      registerButton.textContent = 'Register';
      registerButton.disabled = false;
    });
  }

  dialog.querySelector('#switch-button')?.addEventListener('click', () => {
    const isLogin = dialog.querySelector('h2').textContent === 'Login';
    dialog.innerHTML = isLogin ? getRegisterForm() : getLoginForm();
    setupFormHandlers(dialog);
  });

  dialog.querySelector('#cancel-button')?.addEventListener('click', () => {
    dialog.close();
  });
}

function resetForm() {
  const dialog = document.getElementById('auth-dialog');
  dialog.innerHTML = getLoginForm();
  setupFormHandlers(dialog);
}

function getLoginForm() {
  return `
    <form method="dialog" class="auth-form">
      <h2>Login</h2>
      <input id="username" name="username" placeholder="Username" />
      <input id="password" name="password" type="password" placeholder="Password" />
      <button id="login-button" type="button">Login</button>
      <button id="switch-button" type="button">Switch to Register</button>
      <button id="cancel-button" type="reset">Cancel</button>
    </form>
  `;
}

function getRegisterForm() {
  return `
    <form method="dialog" class="auth-form">
      <h2>Register</h2>
      <input id="username" name="username" placeholder="Username" required />
      <input id="password" name="password" type="password" placeholder="Password" required />
      <input id="email" name="email" type="email" placeholder="Email" required />
      <button id="register-button" type="button">Register</button>
      <button id="switch-button" type="button">Switch to Login</button>
      <button id="cancel-button" type="reset">Cancel</button>
    </form>
  `;
}

async function handleLogin() {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  const user = {
    username,
    password
  };

  const userData = await userLogin(user);
  if (!userData) {
    return false;
  } else {
    setCurrentUser(userData);
    return true;
  }
}

async function handleRegister() {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const email = document.getElementById('email')?.value.trim();

  const user = {
    username,
    password,
    email
  };
  console.log("checking username availability");
  // Check if username is available
  const isAvailable = await checkUserNameAvailability(username);
  if (!isAvailable) {
    alert('Username is already taken. Please choose another one.');
    return false;
  }

  const userData = await createUser(user);
  if (!userData) {
    return false;
  } else {
    setCurrentUser(userData);
    return true;
  }
}

export async function handleLogout() {
  localStorage.removeItem('token');
  setCurrentUser(null);
  updateUserUI(null);
}

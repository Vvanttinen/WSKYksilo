import {createUser, userLogin, checkUserNameAvailability} from './api.js';

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
}

function setupFormHandlers(dialog) {
  dialog.querySelector('#login-button')?.addEventListener('click', () => {
    handleLogin();
    dialog.close();
  });

  dialog.querySelector('#register-button')?.addEventListener('click', () => {
    handleRegister();
    dialog.close();
  });

  dialog.querySelector('#switch-button')?.addEventListener('click', () => {
    const isLogin = dialog.querySelector('h2').textContent === 'Login';
    dialog.innerHTML = isLogin ? getRegisterForm() : getLoginForm();
    setupFormHandlers(dialog);
  });

  dialog.querySelector('#cancel-button')?.addEventListener('click', () => {
    dialog.close();
  });
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
      <input id="username" name="username" placeholder="Username" />
      <input id="password" name="password" type="password" placeholder="Password" />
      <input id="email" name="email" type="email" placeholder="Email" />
      <button id="register-button" type="button">Register</button>
      <button id="switch-button" type="button">Switch to Login</button>
      <button id="cancel-button" type="reset">Cancel</button>
    </form>
  `;
}

function handleLogin() {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  const user = {
    username,
    password
  };

  console.log(`Logging in user: ${JSON.stringify(user)}`);
  userLogin(user);
}

function handleRegister() {
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const email = document.getElementById('email')?.value.trim();

  const user = {
    username,
    password,
    email
  };

  console.log(`Registering user: ${JSON.stringify(user)}`);
  createUser(user);
}

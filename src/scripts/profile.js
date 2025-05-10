import {checkUserNameAvailability, updateUser} from './api.js';
import {updateUserUI} from './dom.js';

let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function createProfileDialog() {
  const dialog = document.createElement('dialog');
  dialog.id = 'profile-dialog';

  dialog.innerHTML = `
    <div class="profile-avatar-container">
      <img id="profile-avatar" src="assets/default-avatar.png" alt="Avatar" class="profile-avatar">
      <div id="avatar-upload-overlay" class="avatar-upload-overlay" style="display: none;">
        <span>Upload</span>
      </div>
    </div>
    <div class="profile-info">
      <div id="profile-username-display"></div>
      <input id="profile-username-input" class="profile-input" style="display: none;">

      <div id="profile-email-display"></div>
      <input id="profile-email-input" class="profile-input" style="display: none;">

    </div>
    <div class="profile-actions">
      <button id="edit-profile-btn">Edit</button>
      <button id="save-profile-btn" style="display: none;">Save</button>
      <button id="cancel-profile-btn" style="display: none;">Cancel</button>
    </div>
  `;

  document.body.appendChild(dialog);

  const editBtn = dialog.querySelector('#edit-profile-btn');
  const saveBtn = dialog.querySelector('#save-profile-btn');
  const cancelBtn = dialog.querySelector('#cancel-profile-btn');
  const avatar = dialog.querySelector('#profile-avatar');
  const avatarOverlay = dialog.querySelector('#avatar-upload-overlay');

  editBtn.addEventListener('click', () => {
    switchToEditMode(true);
  });

  cancelBtn.addEventListener('click', () => {
    switchToEditMode(false);
  });

  saveBtn.addEventListener('click', async () => {
    const updatedUser = {
      username: document.getElementById('profile-username-input').value.trim(),
      email: document.getElementById('profile-email-input').value.trim(),
    };
    if (!updatedUser.username || !updatedUser.email) {
      alert("Please fill in all fields.");
      return;
    }
    if (updatedUser.username === currentUser.username && updatedUser.email === currentUser.email) {
      alert("No changes detected.");
      return;
    }
    const isAvailable = await checkUserNameAvailability();
    if (!isAvailable) {
      alert("Username is already taken. Please choose another.");
      return;
    }

    console.log('Save user:', updatedUser);
    const updatedData = await updateUser(updatedUser);
    if (updatedData) {
      setCurrentUser(updatedData);
      switchToEditMode(false);
      updateUserUI(getCurrentUser());
    } else {
      alert("Failed to update user. Please try again.");
    }
  });

  avatar.addEventListener('click', () => {
    if (editBtn.style.display === 'none') {
      console.log('Avatar clicked for upload');
      // TODO - Implement avatar upload functionality
    }
  });

  function switchToEditMode(isEditing) {
    document.getElementById('profile-username-display').style.display = isEditing ? 'none' : 'block';
    document.getElementById('profile-email-display').style.display = isEditing ? 'none' : 'block';

    document.getElementById('profile-username-input').style.display = isEditing ? 'block' : 'none';
    document.getElementById('profile-email-input').style.display = isEditing ? 'block' : 'none';

    editBtn.style.display = isEditing ? 'none' : 'inline-block';
    saveBtn.style.display = isEditing ? 'inline-block' : 'none';
    cancelBtn.style.display = isEditing ? 'inline-block' : 'none';

    avatarOverlay.style.display = isEditing ? 'flex' : 'none';
  }
}

export function openProfileDialog(user) {
  const dialog = document.getElementById('profile-dialog');

  if (!user) {
    console.warn('openProfileDialog called without a user!');
    return;
  }

  document.getElementById('profile-avatar').src = user.avatar || 'assets/default-avatar.png';
  document.getElementById('profile-username-display').textContent = `Username: ${user.username}`;
  document.getElementById('profile-email-display').textContent = `Email: ${user.email}`;

  document.getElementById('profile-username-input').value = user.username;
  document.getElementById('profile-email-input').value = user.email;

  dialog.showModal();
}

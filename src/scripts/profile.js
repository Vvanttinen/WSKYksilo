import {checkUserNameAvailability, updateUser, uploadAvatar} from './api.js';
import {updateUserUI} from './dom.js';

let currentUser = null;
let selectedAvatarFile = null;
let isEditing = false;

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
      <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
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

  const fileInput = dialog.querySelector('#avatar-file-input');
  const editBtn = dialog.querySelector('#edit-profile-btn');
  const saveBtn = dialog.querySelector('#save-profile-btn');
  const cancelBtn = dialog.querySelector('#cancel-profile-btn');
  const avatar = dialog.querySelector('.profile-avatar-container');
  const avatarOverlay = dialog.querySelector('#avatar-upload-overlay');

  avatar.addEventListener('click', () => {
    if (isEditing) {
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedAvatarFile = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        avatar.src = event.target.result;  // preview selected image
      };
      reader.readAsDataURL(file);
    }
  });

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
    if (updatedUser.username === currentUser.username &&
        updatedUser.email === currentUser.email &&
        !selectedAvatarFile) {
      alert("No changes detected.");
      return;
    }
    const isAvailable = await checkUserNameAvailability();
    if (!isAvailable) {
      alert("Username is already taken. Please choose another.");
      return;
    }

    try {
      if (selectedAvatarFile) {
        const uploadResult = await uploadAvatar(selectedAvatarFile);
        if (!uploadResult) {
          alert("Failed to upload avatar. Please try again.");
          return;
        }
      }
      const updatedData = await updateUser(updatedUser);
      if (updatedData) {
        setCurrentUser(updatedData);
        switchToEditMode(false);
        selectedAvatarFile = null;
        updateUserUI(getCurrentUser());
      } else {
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    }
  });

  function switchToEditMode(editing) {
    isEditing = editing;
    document.getElementById('profile-username-display').style.display = editing ? 'none' : 'block';
    document.getElementById('profile-email-display').style.display = editing ? 'none' : 'block';

    document.getElementById('profile-username-input').style.display = editing ? 'block' : 'none';
    document.getElementById('profile-email-input').style.display = editing ? 'block' : 'none';

    editBtn.style.display = editing ? 'none' : 'inline-block';
    saveBtn.style.display = editing ? 'inline-block' : 'none';
    cancelBtn.style.display = editing ? 'inline-block' : 'none';

    avatarOverlay.style.display = editing ? 'flex' : 'none';
  }
}

export function openProfileDialog(user) {
  const dialog = document.getElementById('profile-dialog');

  if (!user) {
    console.warn('openProfileDialog called without a user!');
    return;
  }

  document.getElementById('profile-avatar').src = "https://media2.edu.metropolia.fi/restaurant/uploads/" + user.avatar || 'assets/default-avatar.png';
  document.getElementById('profile-username-display').textContent = `Username: ${user.username}`;
  document.getElementById('profile-email-display').textContent = `Email: ${user.email}`;

  document.getElementById('profile-username-input').value = user.username;
  document.getElementById('profile-email-input').value = user.email;

  dialog.showModal();
}

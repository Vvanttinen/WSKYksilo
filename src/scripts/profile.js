let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function createProfileDialog() {
  if (document.getElementById('profile-dialog')) return; // avoid duplicate

  const dialog = document.createElement('dialog');
  dialog.id = 'profile-dialog';
  dialog.innerHTML = `
    <form method="dialog" class="profile-form">
      <h2>Your Profile</h2>
      <div id="profile-content"></div>
      <button type="button" id="close-profile">Close</button>
    </form>
  `;
  document.body.appendChild(dialog);

  const closeButton = dialog.querySelector('#close-profile');
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
}

export function openProfileDialog() {
  const dialog = document.getElementById('profile-dialog');
  const profileContent = document.getElementById('profile-content');

  if (currentUser) {
    profileContent.innerHTML = `
      <div class="profile-avatar">
        <img src="${currentUser.avatarUrl || 'assets/default-avatar.png'}" alt="User Avatar" />
      </div>
      <p><strong>Username:</strong> ${currentUser.username}</p>
      <p><strong>Email:</strong> ${currentUser.email}</p>
    `;
  } else {
    profileContent.innerHTML = `<p>No user is currently logged in.</p>`;
  }

  dialog.showModal();
}

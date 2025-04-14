function loginWithDiscord() {
    const discordOAuthURL =
      'https://discord.com/oauth2/authorize?client_id=1143523217563197440&response_type=code&redirect_uri=http%3A%2F%2Flocalhost&scope=identify';
    window.location.href = discordOAuthURL;
  }
  
  async function fetchUserData(code) {
    try {
      const response = await fetch(`/discord-auth.php?code=${code}`);
      const userData = await response.json();
      handleLoginSuccess(userData);
      localStorage.setItem('fmUserData', JSON.stringify(userData));
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  }
  
  function handleLoginSuccess(userData) {
    const loginButton = document.getElementById('login-button');
    const userMenu = document.getElementById('user-menu');
  
    // Удаляем старый аватар если он есть
    const oldAvatar = document.getElementById('avatar');
    if (oldAvatar) oldAvatar.remove();
  
    const avatar = document.createElement('img');
    avatar.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
    avatar.alt = "Avatar";
    avatar.className = "avatar";
    avatar.id = "avatar";
    avatar.onclick = toggleMenu;
  
    loginButton.style.display = 'none';
    loginButton.parentNode.insertBefore(avatar, loginButton);
  
    userMenu.classList.remove('visible');
  
    // Обновим Discord блок профиля
    const discordInfo = document.querySelector(".account-block .account-info");
    if (discordInfo) {
      discordInfo.textContent = `@${userData.username} / ${userData.id}`;
    }
  }
  
  function toggleMenu() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('visible');
  }
  
  function logout() {
    alert("Вы вышли из аккаунта.");
    const avatar = document.getElementById('avatar');
    if (avatar) avatar.remove();
  
    const loginButton = document.getElementById('login-button');
    loginButton.style.display = 'inline';
  
    const menu = document.getElementById('user-menu');
    menu.classList.remove('visible');
  
    localStorage.removeItem('fmUserData');
  
    // Очистим Discord блок в профиле
    const discordInfo = document.querySelector(".account-block .account-info");
    if (discordInfo) {
      discordInfo.textContent = "Нет данных";
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const savedData = localStorage.getItem('fmUserData');
    if (savedData) {
      const userData = JSON.parse(savedData);
      handleLoginSuccess(userData);
    }
  
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
      loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginWithDiscord();
      });
    }
  
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      fetchUserData(code);
      window.history.replaceState({}, document.title, window.location.pathname); // убираем ?code=
    }
  
    document.addEventListener("click", (e) => {
      const avatar = document.getElementById("avatar");
      const menu = document.getElementById("user-menu");
      if (menu && !menu.contains(e.target) && avatar && !avatar.contains(e.target)) {
        menu.classList.remove("visible");
      }
    });
  });
  
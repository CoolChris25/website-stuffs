
function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);

  localStorage.setItem('selected-theme', themeName);
  
  console.log("Switched to " + themeName + " mode!");

window.onload = function() {
    const savedTheme = localStorage.getItem('selected-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

function toggleThemeMenu(event) {
    if (event) event.stopPropagation(); 
    
    const menu = document.getElementById("themeMenuContent");
    menu.classList.toggle("show");
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById("themeMenuContent");
    const trigger = document.querySelector(".menu-trigger");
    
    if (menu.classList.contains('show') && !menu.contains(event.target) && event.target !== trigger) {
        menu.classList.remove('show');
    }
});

// Easter Egg: Click the info icon 5 times within 2 seconds to unlock the secret page
let infoClicks = 0;
const infoIcon = document.querySelector('#info-icon'); // Or whatever your class is

infoIcon.addEventListener('click', () => {
    infoClicks++;
    
    if (infoClicks === 5) {
        window.location.href = './steamy-hot-garbage.html';

    }
    setTimeout(() => { infoClicks = 0; }, 2000);
});
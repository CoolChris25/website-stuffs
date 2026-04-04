let myData = [];
let focusIndex = -1;

const input = document.getElementById('myInput');
const list = document.getElementById('results');

async function loadSearchData() {
  try {
    const response = await fetch('./data.json');
    myData = await response.json();
  } catch (error) {
    console.error(error);
  }
}

loadSearchData();

input.oninput = (e) => {
  let val = e.target.value.toLowerCase();
  list.innerHTML = '';
  focusIndex = -1;

  if (val.length < 1) {
    list.style.display = 'none';
    return;
  }

  const matches = myData.filter(item => 
    item.title.toLowerCase().includes(val)
  );

  if (matches.length > 0) {
    list.style.display = 'block';
    matches.forEach((match, index) => {
      let li = document.createElement('li');
      li.classList.add('results-item');
      const regex = new RegExp(`(${val})`, 'gi');
      li.innerHTML = match.title.replace(regex, `<span class="highlight">$1</span>`);
      li.onclick = () => { window.location.href = match.url; };
      list.appendChild(li);
    });
  } else {
    list.style.display = 'none';
  }
};

input.onkeydown = (e) => {
  const items = list.getElementsByTagName('li');
  
  if (e.key === "ArrowDown") {
    focusIndex = (focusIndex + 1) % items.length;
    updateSelection(items);
  } 
  else if (e.key === "ArrowUp") {
    focusIndex = (focusIndex - 1 + items.length) % items.length;
    updateSelection(items);
  } 
  else if (e.key === "Enter") {
    if (focusIndex > -1) {
      items[focusIndex].click();
    } else if (items.length > 0) {
      items[0].click();
    }
  }
};

function updateSelection(items) {
  Array.from(items).forEach(li => li.classList.remove('active'));
  if (items[focusIndex]) {
    items[focusIndex].classList.add('active');
  }
}

document.addEventListener('click', (e) => {
  if (e.target !== input) list.style.display = 'none';
});

function darkModeActivated() {


}

function applyTheme(themeName) {
  // 1. Change the attribute on the <html> tag
  document.documentElement.setAttribute('data-theme', themeName);

  localStorage.setItem('selected-theme', themeName);
  
  console.log("Switched to " + themeName + " mode!");

window.onload = function() {
    const savedTheme = localStorage.getItem('selected-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
}

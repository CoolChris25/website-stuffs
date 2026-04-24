let myData = [];
let focusIndex = -1;

const input = document.querySelector(".search-bar");
const list = document.querySelector(".results");

async function loadSearchData() {
  const dataSource = input.getAttribute('data-source'); 
  
  if (!dataSource) {
    console.warn("Search Engine: No data-source attribute found on #MainSearch.");
    return;
  }

  try {
    const response = await fetch(dataSource);
    myData = await response.json();
    console.log(`Search Engine: Loaded ${myData.length} entries from ${dataSource}`);
  } catch (error) {
    console.error("Search Engine: Fatal Pathing Error!", error);
  }
}

loadSearchData();

// --- SEARCH LOGIC (The Core Engine) ---

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
      
      // High-Fidelity Highlighting
      const regex = new RegExp(`(${val})`, 'gi');
      li.innerHTML = match.title.replace(regex, `<span class="highlight">$1</span>`);
      
      // The Click Protocol
      li.onclick = () => { window.location.href = match.url; };
      list.appendChild(li);
    });
  } else {
    list.style.display = 'none';
  }
};

// --- NAVIGATION LOGIC (Keyboard Support) ---

input.onkeydown = (e) => {
  const items = list.getElementsByTagName('li');
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault(); // Stop the cursor from jumping
    focusIndex = (focusIndex + 1) % items.length;
    updateSelection(items);
  } 
  else if (e.key === "ArrowUp") {
    e.preventDefault();
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
    // Ensure the selected item is visible in the scrollable list
    items[focusIndex].scrollIntoView({ block: 'nearest' });
  }
}

// Click-Away logic to hide results
document.addEventListener('click', (e) => {
  if (e.target !== input) list.style.display = 'none';
});
const eventsEl = document.getElementById('events');
const paginationEl = document.getElementById('pagination');

const limit = 20;
let currentPage = 1;

async function fetchEvents(page = 1) {
  const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?limit=${limit}&page=${page - 1}&countryCode=US&segmentName=Film&apikey=49FrD8b5pF7reRwv5Ebt667wyQ9AQQPZ`);
  const data = await res.json();
  return data._embedded?.events || [];
}

function renderEvents(events) {
  eventsEl.innerHTML = '';
  events.forEach(ev => {
    const image = ev.images?.[0]?.url || '';
    const title = ev.name || 'No title';
    const date = ev.dates?.start?.localDate || 'No date';
    const venue = ev._embedded?.venues?.[0]?.name || 'No venue';

    eventsEl.innerHTML += `
      <div class="event">
        <img src="${image}" alt="${title}">
        <div class="title">${title}</div>
        <div class="date">${date}</div>
        <div class="venue">${venue}</div>
      </div>
    `;
  });
}

async function update() {
  const events = await fetchEvents(currentPage);
  renderEvents(events);
  renderPagination(20); 
}

update();

function renderPagination(totalPages) {
  paginationEl.innerHTML = '';

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    addPageButton(1);
    if (startPage > 2) {
      addDots();
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageButton(i, i === currentPage);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      addDots();
    }
    addPageButton(totalPages);
  }

  function addPageButton(page, isActive = false) {
    const btn = document.createElement('button');
    btn.textContent = page;
    btn.className = isActive ? 'active' : '';
    btn.addEventListener('click', () => {
      currentPage = page;
      update();
    });
    paginationEl.appendChild(btn);
  }

  function addDots() {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.color = '#aaa';
    paginationEl.appendChild(dots);
  }
}

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    update();
    return;
  }

  const allEvents = await fetchEvents(1);

  const filtered = allEvents.filter(ev =>
    ev.name.toLowerCase().startsWith(query)
  );

  renderEvents(filtered);
  renderPagination(1);
});

//

function renderEvents(events) {
  eventsEl.innerHTML = '';
  events.forEach(ev => {
    const image = ev.images?.[0]?.url || '';
    const title = ev.name || 'No title';
    const date = ev.dates?.start?.localDate || 'No date';
    const venue = ev._embedded?.venues?.[0]?.name || 'No venue';
    const info = ev.info || 'No info';
    const url = ev.url || '#';

    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `
      <img src="${image}" alt="${title}">
      <div class="title">${title}</div>
      <div class="date">${date}</div>
      <div class="venue">${venue}</div>
    `;
    div.addEventListener('click', () => {
      showModal({ title, date, venue, info, image, url });
    });

    eventsEl.appendChild(div);
  });
}

function showModal({ title, date, venue, info, image, url }) {
  const modal = document.getElementById('modal');
  const details = document.getElementById('modal-details');

  details.innerHTML = `
    <h2>${title}</h2>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Venue:</strong> ${venue}</p>
    <p><strong>Info:</strong> ${info}</p>
    <img src="${image}" alt="${title}" style="width:100%; border-radius:12px; margin-top:12px">
  `;

  modal.classList.remove('hidden');
}

document.querySelector('.modal .close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

window.addEventListener('click', e => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
  }
});

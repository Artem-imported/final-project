const eventsEl = document.getElementById('events');
const paginationEl = document.getElementById('pagination');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');

const limit = 20;
let currentPage = 1;
let allEvents = [];

async function fetchEvents(page = 1) {
  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?limit=${limit}&page=${page - 1}&countryCode=US&segmentName=Film&apikey=49FrD8b5pF7reRwv5Ebt667wyQ9AQQPZ`);
    const data = await res.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

function renderEvents(events) {
  eventsEl.innerHTML = '';
  events.forEach(event => {
    const image = event.images?.[0]?.url || '';
    const title = event.name || 'No title';
    const date = event.dates?.start?.localDate || 'No date';
    const venue = event._embedded?.venues?.[0]?.name || 'No venue';
    const info = event.info || 'No info';
    const url = event.url || '#';
    const artist = event.promoter?.name || 'Unknown';
    const time = event.dates?.start?.localTime || '';

    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `
      <img src="${image}" alt="${title}">
      <div class="title">${title}</div>
      <div class="date">${date}</div>
      <div class="venue">${venue}</div>
    `;
    div.addEventListener('click', () => {
      showModal({ title, date, venue, info, image, url, artist, time });
    });

    eventsEl.appendChild(div);
  });
}

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
    if (startPage > 2) addDots();
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageButton(i, i === currentPage);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) addDots();
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
    dots.className = 'dots';
    dots.style.color = `white`
    paginationEl.appendChild(dots);
  }
}

function showModal(data) {
  const maxLength = 520;
  const trimmedInfo = data.info.length > maxLength
    ? data.info.slice(0, maxLength) + '...'
    : data.info;

  document.getElementById('modal-image').src = data.image;
  document.getElementById('modal-image-top').src = data.image;

  const infoEl = document.getElementById('modal-info');
  const dateEl = document.getElementById('modal-date');
  const whereEl = document.getElementById('modal-where');
  const whoEl = document.getElementById('modal-who');
  const buy1 = document.getElementById('modal-buy1');
  const buy2 = document.getElementById('modal-buy2');
  const author = document.getElementById('modal-author');

  infoEl.textContent = trimmedInfo;
  dateEl.textContent = `${data.date} ${data.time}`;
  whereEl.textContent = data.venue;
  whoEl.textContent = data.artist;
  buy1.href = data.url;
  buy2.href = data.url;
  author.href = data.url;

  [infoEl, dateEl, whereEl, whoEl].forEach(el => {
    el.style.fontFamily = 'Montserrat';
    el.style.fontSize = '16px';
    el.style.fontWeight = '400';
  });

  modal.classList.remove('hidden');
}

document.querySelector('.modal .close').addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', e => {
  if (e.target === modal) modal.classList.add('hidden');
});

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return update();

  const events = await fetchEvents(1);
  const filtered = events.filter(ev => ev.name.toLowerCase().startsWith(query));
  renderEvents(filtered);
  renderPagination(1);
});

async function update() {
  const events = await fetchEvents(currentPage);
  allEvents = events;
  renderEvents(events);
  renderPagination(20); 
}

update();

//

async function getVenues() {
  const events = await fetchEvents(currentPage);
  const venueSet = new Set();

  events.forEach(ev => {
    const venue = ev._embedded?.venues?.[0]?.name;
    if (venue) venueSet.add(venue); // Убираем повторы автоматически
  });

  return Array.from(venueSet);
}
async function populateVenueSelect() {
  const venueSet = new Set();

  allEvents.forEach(ev => {
    const venue = ev._embedded?.venues?.[0]?.name;
    if (venue) venueSet.add(venue);
  });

  const select = document.getElementById('country');
  select.innerHTML = `<option value="">All venues</option>`;

  Array.from(venueSet).forEach(venue => {
    const option = document.createElement('option');
    option.value = venue;
    option.textContent = venue;
    select.appendChild(option);
  });
}

async function update() {
  const events = await fetchEvents(currentPage);
  allEvents = events;
  renderEvents(events);
  renderPagination(20);
  await populateVenueSelect(); // 👈 добавил
}
document.getElementById('country').addEventListener('change', (event) => {
  const selectedVenue = event.target.value;
  if (!selectedVenue) {
    renderEvents(allEvents); // Показать все
    return;
  }

  const filtered = allEvents.filter(ev =>
    ev._embedded?.venues?.[0]?.name === selectedVenue
  );
  renderEvents(filtered);
});
async function update() {
  const events = await fetchEvents(currentPage);
  allEvents = events;
  renderEvents(events);
  renderPagination(20);
  populateVenueSelect(); // 👈 добавлено
}

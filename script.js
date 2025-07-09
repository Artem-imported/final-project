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

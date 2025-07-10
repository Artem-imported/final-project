// const eventsEl = document.getElementById('events');
// const paginationEl = document.getElementById('pagination');

// const limit = 20;
// let currentPage = 1;

// async function fetchEvents(page = 1) {
//   const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?limit=${limit}&page=${page - 1}&countryCode=US&segmentName=Film&apikey=49FrD8b5pF7reRwv5Ebt667wyQ9AQQPZ`);
//   const data = await res.json();
//   return data._embedded?.events || [];
// }

// function renderEvents(events) {
//   eventsEl.innerHTML = '';
//   events.forEach(ev => {
//     const image = ev.images?.[0]?.url || '';
//     const title = ev.name || 'No title';
//     const date = ev.dates?.start?.localDate || 'No date';
//     const venue = ev._embedded?.venues?.[0]?.name || 'No venue';

//     eventsEl.innerHTML += `
//       <div class="event">
//         <img src="${image}" alt="${title}">
//         <div class="title">${title}</div>
//         <div class="date">${date}</div>
//         <div class="venue">${venue}</div>
//       </div>
//     `;
//   });
// }

// async function update() {
//   const events = await fetchEvents(currentPage);
//   renderEvents(events);
//   renderPagination(20); 
// }

// update();

// function renderPagination(totalPages) {
//   paginationEl.innerHTML = '';

//   const maxVisible = 5;
//   let startPage = Math.max(1, currentPage - 2);
//   let endPage = Math.min(totalPages, startPage + maxVisible - 1);

//   if (endPage - startPage < maxVisible - 1) {
//     startPage = Math.max(1, endPage - maxVisible + 1);
//   }

//   if (startPage > 1) {
//     addPageButton(1);
//     if (startPage > 2) {
//       addDots();
//     }
//   }

//   for (let i = startPage; i <= endPage; i++) {
//     addPageButton(i, i === currentPage);
//   }

//   if (endPage < totalPages) {
//     if (endPage < totalPages - 1) {
//       addDots();
//     }
//     addPageButton(totalPages);
//   }

//   function addPageButton(page, isActive = false) {
//     const btn = document.createElement('button');
//     btn.textContent = page;
//     btn.className = isActive ? 'active' : '';
//     btn.addEventListener('click', () => {
//       currentPage = page;
//       update();
//     });
//     paginationEl.appendChild(btn);
//   }

//   function addDots() {
//     const dots = document.createElement('span');
//     dots.textContent = '...';
//     dots.style.color = '#aaa';
//     paginationEl.appendChild(dots);
//   }
// }

// const searchInput = document.getElementById('search');

// searchInput.addEventListener('input', async () => {
//   const query = searchInput.value.trim().toLowerCase();
//   if (!query) {
//     update();
//     return;
//   }

//   const allEvents = await fetchEvents(1);

//   const filtered = allEvents.filter(ev =>
//     ev.name.toLowerCase().startsWith(query)
//   );

//   renderEvents(filtered);
//   renderPagination(1);
// });

// //

// function renderEvents(events) {
//   eventsEl.innerHTML = '';
//   events.forEach(ev => {
//     const image = ev.images?.[0]?.url || '';
//     const title = ev.name || 'No title';
//     const date = ev.dates?.start?.localDate || 'No date';
//     const venue = ev._embedded?.venues?.[0]?.name || 'No venue';
//     const info = ev.info || 'No info';
//     const url = ev.url || '#';

//     const div = document.createElement('div');
//     div.className = 'event';
//     div.innerHTML = `
//       <img src="${image}" alt="${title}">
//       <div class="title">${title}</div>
//       <div class="date">${date}</div>
//       <div class="venue">${venue}</div>
//     `;
//     div.addEventListener('click', () => {
//       showModal({ title, date, venue, info, image, url });
//     });

//     eventsEl.appendChild(div);
//   });
// }

// function showModal({ title, date, venue, info, image, url }) {
//   const modal = document.getElementById('modal');
//   const details = document.getElementById('modal-details');

//   details.innerHTML = `
//     <h2>${title}</h2>
//     <p><strong>Date:</strong> ${date}</p>
//     <p><strong>Venue:</strong> ${venue}</p>
//     <p><strong>Info:</strong> ${info}</p>
//     <img src="${image}" alt="${title}" style="width:100%; border-radius:12px; margin-top:12px">
//     <p style="margin-top:12px;"><a href="${url}" target="_blank" style="color:#a445ed;">View on Ticketmaster</a></p>
//   `;

//   modal.classList.remove('hidden');
// }

// document.querySelector('.modal .close').addEventListener('click', () => {
//   document.getElementById('modal').classList.add('hidden');
// });

// window.addEventListener('click', e => {
//   if (e.target.id === 'modal') {
//     document.getElementById('modal').classList.add('hidden');
//   }
// });

// function showModal(eventData) {
//   document.getElementById('modal-image').src = eventData.image;
//   document.getElementById('modal-info').textContent = eventData.info || 'No info';
//   document.getElementById('modal-date').textContent = `${eventData.date} ${eventData.time || ''}`;
//   document.getElementById('modal-where').textContent = eventData.venue || 'Unknown venue';
//   document.getElementById('modal-who').textContent = eventData.artist || 'Unknown artist';

//   document.getElementById('modal-buy1').href = eventData.url;
//   document.getElementById('modal-buy2').href = eventData.url;
//   document.getElementById('modal-author').href = eventData.url;

//   document.getElementById('modal').classList.remove('hidden');
// }

// document.querySelector('.modal .close').addEventListener('click', () => {
//   document.getElementById('modal').classList.add('hidden');
// });

// div.addEventListener('click', () => {
//   showModal({
//     image,
//     title,
//     date,
//     time: ev.dates?.start?.localTime || '',
//     venue,
//     info,
//     artist: ev.promoter?.name || 'Unknown',
//     url
//   });
// });
// Main DOM elements
const eventsEl = document.getElementById('events');
const paginationEl = document.getElementById('pagination');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');

// Config
const limit = 20;
let currentPage = 1;
let allEvents = [];

// Fetch events from API
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

// Render events to DOM
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

// Render pagination buttons
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
    paginationEl.appendChild(dots);
  }
}

// Modal logic
function showModal(data) {
  document.getElementById('modal-image').src = data.image;
  document.getElementById('modal-info').textContent = data.info;
  document.getElementById('modal-date').textContent = `${data.date} ${data.time}`;
  document.getElementById('modal-where').textContent = data.venue;
  document.getElementById('modal-who').textContent = data.artist;
  document.getElementById('modal-buy1').href = data.url;
  document.getElementById('modal-buy2').href = data.url;
  document.getElementById('modal-author').href = data.url;
  modal.classList.remove('hidden');
}

document.querySelector('.modal .close').addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', e => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Live search
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return update();

  const events = await fetchEvents(1);
  const filtered = events.filter(ev => ev.name.toLowerCase().startsWith(query));
  renderEvents(filtered);
  renderPagination(1);
});

// Main load
async function update() {
  const events = await fetchEvents(currentPage);
  allEvents = events;
  renderEvents(events);
  renderPagination(20); // Total pages is fixed for now
}

update();

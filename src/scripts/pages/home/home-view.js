class HomeView {
  constructor() {
    this.storiesContainer = null;
    this.addStoryLink = null;
    this.mapContainer = null;
    this.fetchButton = null;
  }

  render() {
    return `
      <section class="container">
        <h1 class="page-title">Daftar Story</h1>
        <button id="fetch-stories-btn" class="btn btn-info">Ambil Data dari API</button>
        <div id="stories" class="stories-grid"></div>
        <div id="add-story-link"></div>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  }

  initElements() {
    this.storiesContainer = document.getElementById('stories');
    this.addStoryLink = document.getElementById('add-story-link');
    this.mapContainer = document.getElementById('map');
    this.fetchButton = document.getElementById('fetch-stories-btn');
  }

  initMap(stories) {
    if (!this.mapContainer) return;
    const map = L.map('map').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: '/leaflet/images/pin-map.png',
      iconSize: [25, 37],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    stories.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  updateStories(storiesHTML) {
    this.storiesContainer.innerHTML = storiesHTML;
  }

  updateAddStoryLink(linkHTML) {
    this.addStoryLink.innerHTML = linkHTML;
  }

  bindFetchButton(handler) {
    if (this.fetchButton) {
      this.fetchButton.addEventListener('click', handler);
    }
  }

  bindDeleteButtons(handler) {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => handler(btn.dataset.id));
    });
  }

  removeStoryCard(id) {
    const card = document.querySelector(`.story-card[data-id="${id}"]`);
    if (card) card.remove();
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  navigateToLogin() {
    window.location.hash = '#/login';
  }
}

export default HomeView;
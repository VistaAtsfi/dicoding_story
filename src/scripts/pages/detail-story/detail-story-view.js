class DetailStoryView {
  constructor() {
    this.storyDetailContainer = null;
    this.mapContainer = null;
  }

  render() {
    return `
      <section class="container">
        <h1 class="page-title">Detail Story</h1>
        <article class="story-card">
          <div id="story-detail">Memuat data...</div>
        </article>
        <div id="map" style="height: 300px; margin-bottom: 20px;"></div>
      </section>
    `;
  }

  async afterRender() {
    this.storyDetailContainer = document.getElementById('story-detail');
    this.mapContainer = document.getElementById('map');
  }

  initMap(lat, lon, name, description) {
    if (!this.mapContainer) return;
    const map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: '/leaflet/images/pin-map.png',
      iconSize: [25, 37],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    L.marker([lat, lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${name}</b><br>${description}`)
      .openPopup();
  }

  renderStoryDetail(story) {
    this.storyDetailContainer.innerHTML = `
      <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="story-image" loading="lazy">
      <div class="story-content">
        <h2 class="story-title">${story.name}</h2>
        <p class="story-desc">${story.description}</p>
        <p class="story-date">${story.formattedDate}</p>
      </div>
    `;
  }

  renderError(message) {
    this.storyDetailContainer.innerHTML = `<p>${message}</p>`;
  }

  navigateToLogin() {
    setTimeout(() => (window.location.hash = '#/login'), 1000);
  }
}

export default DetailStoryView;
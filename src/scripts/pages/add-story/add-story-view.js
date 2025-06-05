class AddStoryView {
  constructor() {
    this.mapContainer = null;
    this.photoInput = null;
    this.captureBtn = null;
    this.video = null;
    this.canvas = null;
    this.form = null;
    this.map = null;
    this.lat = null;
    this.lon = null;
  }

  render() {
    return `
      <section class="container">
        <h1 class="page-title">Tambah Story</h1>
        <form id="add-story-form" class="form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required aria-required="true" placeholder="Masukkan deskripsi story"></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Foto</label>
            <input type="file" id="photo" name="photo" accept="image/*" required aria-required="true">
            <button type="button" id="capture-btn" class="btn btn-secondary" style="margin-top: 10px;" aria-label="Gunakan Kamera">Gunakan Kamera</button>
            <video id="camera-stream" autoplay playsinline style="display: none; width: 100%; max-width: 400px; margin-top: 10px;"></video>
          </div>
          <div class="form-group">
            <label>Pilih Lokasi di Peta</label>
            <div id="map" style="height: 300px; margin-bottom: 20px;"></div>
          </div>
          <button type="submit" class="btn btn-primary" aria-label="Tambah Story">Tambah</button>
        </form>
      </section>
    `;
  }

  initElements() {
    this.mapContainer = document.getElementById('map');
    this.photoInput = document.getElementById('photo');
    this.captureBtn = document.getElementById('capture-btn');
    this.video = document.getElementById('camera-stream');
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.form = document.getElementById('add-story-form');
  }

  async initMap() {
    if (!this.mapContainer) return;
    this.map = L.map('map').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: '/leaflet/images/pin-map.png',
      iconSize: [25, 37],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    this.map.on('click', (e) => {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker) this.map.removeLayer(layer);
      });
      L.marker([this.lat, this.lon], { icon: customIcon })
        .addTo(this.map)
        .bindPopup('Lokasi Story')
        .openPopup();
    });
  }

  initCamera() { }

  async capturePhoto() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.video.srcObject = stream;
    this.video.style.display = 'block';

    await new Promise(resolve => setTimeout(resolve, 2000));
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const blob = await new Promise(resolve => this.canvas.toBlob(resolve, 'image/jpeg', 0.9));
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    this.photoInput.files = dataTransfer.files;

    stream.getTracks().forEach(track => track.stop());
    this.video.style.display = 'none';
  }

  bindCaptureButton(handler) {
    this.captureBtn.addEventListener('click', handler);
  }

  bindFormSubmit(handler) {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const description = this.form.description.value.trim();
      const photo = this.form.photo.files[0];
      handler(description, photo, this.lat, this.lon);
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  navigateToHome() {
    setTimeout(() => (window.location.hash = '#/'), 1000);
  }
}

export default AddStoryView;
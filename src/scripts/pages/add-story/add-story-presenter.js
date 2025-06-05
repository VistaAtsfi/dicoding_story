class AddStoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async afterRender() {
    this.view.initElements();
    await this.view.initMap();
    this.view.initCamera();
    this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
    this.view.bindCaptureButton(this.handleCapture.bind(this));
  }

  async handleCapture() {
    try {
      await this.view.capturePhoto();
    } catch (error) {
      this.view.showNotification(`Gagal mengakses kamera: ${error.message}`, 'error');
    }
  }

  async handleFormSubmit(description, photo, lat, lon) {
    const token = this.model.getToken();
    if (!token) {
      this.view.showNotification('Silakan login terlebih dahulu', 'error');
      return;
    }

    if (!description || !photo) {
      this.view.showNotification('Deskripsi dan foto wajib diisi', 'error');
      return;
    }

    if (photo.size > 1024 * 1024) {
      this.view.showNotification('Ukuran foto maksimal 1MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    try {
      await this.model.saveStory(formData, token);
      this.view.showNotification('Story berhasil ditambahkan', 'success');
      this.view.navigateToHome();
    } catch (error) {
      this.view.showNotification(`Error: ${error.message}`, 'error');
    }
  }
}

export default AddStoryPresenter;
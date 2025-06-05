class AboutView {
    render() {
        return `
      <section class="container">
        <h1 class="page-title">About Us</h1>
        <div class="about-text">
          <p>Ini adalah aplikasi Dicoding Story yang dibuat untuk belajar pengembangan web. Aplikasi ini memungkinkan pengguna untuk berbagi cerita dengan lokasi dan foto.</p>
          <p>Dikembangkan oleh: Vista</p>
          <p>Tanggal: ${new Date().toLocaleDateString()}</p>
        </div>
      </section>
    `;
    }
}

export default AboutView;
class NotFoundPage {
  async render() {
    return `
      <section class="container">
        <h1 class="page-title">404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada.</p>
        <a href="#/" class="btn btn-primary">Kembali ke Home</a>
      </section>
    `;
  }

  async afterRender() {
    console.log('404 Page afterRender');
  }
}

export default NotFoundPage;

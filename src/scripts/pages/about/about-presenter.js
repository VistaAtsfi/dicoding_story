class AboutPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    async afterRender() {
        // Tidak ada aksi khusus setelah render untuk halaman About
    }
}

export default AboutPresenter;
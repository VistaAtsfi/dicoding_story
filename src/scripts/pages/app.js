import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import PushNotificationHelper from '../utils/push-notification';

class App {
  constructor({ navigationDrawer, drawerButton, content }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this.setupDrawer();
    PushNotificationHelper.init();
  }

  setupDrawer() {
    this.drawerButton.addEventListener('click', () => this.navigationDrawer.classList.toggle('open'));

    document.addEventListener('click', event => {
      const { target } = event;
      if (!this.navigationDrawer.contains(target) && !this.drawerButton.contains(target)) {
        this.navigationDrawer.classList.remove('open');
      }

      const link = target.closest('a, button');
      if (link?.href?.startsWith('#')) {
        event.preventDefault();
        this.handleNavigation(link.getAttribute('href'));
      }
    });

    const logoutButton = document.getElementById('logout-menu-btn');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        this.showNotification('Berhasil logout', 'info');
        window.location.hash = '#/login';
      });
    }

    const pushToggle = document.getElementById('push-toggle');
    if (pushToggle) {
      pushToggle.addEventListener('change', () => PushNotificationHelper.toggleSubscription(pushToggle.checked));
    }
  }

  handleNavigation(url) {
    const token = localStorage.getItem('token');
    if (url === '#/add-story' && !token) {
      this.showNotification('Silakan login terlebih dahulu', 'warning');
      window.location.hash = '#/login';
    } else if (url.startsWith('#/story-detail') && !new URLSearchParams(url.split('?')[1])?.get('id')) {
      this.showNotification('ID cerita tidak valid', 'warning');
      window.location.hash = '#/';
    } else {
      window.location.hash = url;
    }
  }

  async renderPage() {
    const route = getActiveRoute();
    const isAuthenticated = !!localStorage.getItem('token');
    const protectedRoutes = ['/', '/add-story', '/story-detail'];

    if (protectedRoutes.includes(route) && !isAuthenticated) {
      this.showNotification('Anda harus login untuk mengakses halaman ini.', 'warning');
      if (window.location.hash !== '#/login') window.location.hash = '#/login';
      return;
    }

    if (isAuthenticated && (route === '/login' || route === '/register')) {
      this.showNotification('Anda sudah login.', 'info');
      if (window.location.hash !== '#/') window.location.hash = '#/';
      return;
    }

    const pageFactory = routes[route] || routes['/404'];
    if (typeof pageFactory !== 'function') {
      console.error(`Invalid page factory for route "${route}"`);
      this.content.innerHTML = '<p>Konfigurasi rute aplikasi bermasalah.</p>';
      return;
    }

    const page = pageFactory();
    if (typeof page.render !== 'function') {
      console.error(`Page instance for route "${route}" lacks render method`);
      this.content.innerHTML = '<p>Halaman tidak valid.</p>';
      return;
    }

    try {
      const html = await page.render();
      if ('startViewTransition' in document) {
        await document.startViewTransition(async () => {
          this.content.innerHTML = html;
          if (page.afterRender) await page.afterRender();
        });
      } else {
        this.content.innerHTML = html;
        if (page.afterRender) await page.afterRender();
      }
    } catch (error) {
      console.error('Render error:', error);
      this.content.innerHTML = '<p>Terjadi kesalahan saat memuat halaman.</p>';
    }

    const logoutButton = document.getElementById('logout-menu-btn');
    if (logoutButton) logoutButton.style.display = isAuthenticated ? 'block' : 'none';
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

export default App;
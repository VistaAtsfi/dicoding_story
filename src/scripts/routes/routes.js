import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';
import NotFoundPage  from '../pages/404/not-found-page';

const routes = {
  '/': () => new HomePage(), 
  '/about': () => new AboutPage(),
  '/login': () => new LoginPage(), 
  '/register': () => new RegisterPage(), 
  '/add-story': () => new AddStoryPage(),
  '/story-detail': () => new DetailStoryPage(),
  '/404': () => new NotFoundPage()
};

export default routes;
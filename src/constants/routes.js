export const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

export const SERVER_URL =
  process.env.NODE_ENV === 'development' ? 'http://10.42.0.1:4000' : '';

export const HOME = '/';

export const INSTITUTIONS = '/institutions/:id';

export const ABOUT = '/about';

export const DASHBOARD = '/dashboard';

export const LEGAL = '/legal';

export const UPLOAD = '/upload';

export const SIGNUP = '/signup';

export const LOGIN = '/login';

export const INSTITUTIONS_ = '/institutions/:id';

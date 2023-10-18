/* eslint-disable no-undef */
export const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';


export const SERVER_URL = "http://192.168.43.79:4000";

// https://pptlink-node-backend.onrender.com/

// export const SERVER_URL = 'https://pptlink-node-backend.onrender.com';


export const HOME = '/';

export const INSTITUTIONS = '/institutions';

export const INSTITUTIONS_ID = '/institutions/:id';

export const ABOUT = '/about';

export const DASHBOARD = '/dashboard';

export const LEGAL = '/legal';

export const UPLOAD = '/upload';

export const SIGNUP = '/signup';

export const LOGIN = '/login';

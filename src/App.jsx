import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Login from './components/log in/login';
import Dashboard from './components/profile/dashboard';
import List from './components/list/list';
import Upload from './components/upload/upload';
import Interface from './components/interface/Interface';
import Root from './components/root/root';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Root />}>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
          <Route path='login' element={<Login />} />
          <Route path='dashboard/:id' element={<Dashboard />} />
          <Route path='list/:id' element={<List />} />
          <Route path='upload' element={<Upload />} />
        </Route>
        <Route path='interface' element={<Interface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navbar } from "./components/app/Navbar";
import { Home } from './pages/Home';
import { Summary } from './pages/Summary';

export function App() {
  return (
    <BrowserRouter>
      <div className="h-full">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/summary' element={<Summary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

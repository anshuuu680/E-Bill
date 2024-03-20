import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header, Navbar, Dashboard, Login, Pdf } from './index.js';
import './index.css';
import Invoice from './Components/Invoice.jsx';
import SignUp from './Components/SignUp.jsx';
import SecuredRoutes from './SecuredRoutes.jsx';

const Content = () => {
  return (
    <div className='flex h-screen'>
      <Navbar />
      <section className='w-full h-screen flex flex-col'>
        <Header />
        <div
          style={{
            flex: 1,
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
          className="container scroll"
        >
          <Routes>
            <Route path='/owner/dashboard' element={<Dashboard />} />
            <Route path='/owner/invoice' element={<Invoice />} />
            <Route path='/owner/invoice/receipt' element={<Pdf />} />
          </Routes>
        </div>
      </section>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<SecuredRoutes />}>
          <Route path='/*' element={<Content />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

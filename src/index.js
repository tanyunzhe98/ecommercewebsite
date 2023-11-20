import React, { useState } from "react";
import UserContext from "./UserContext";
import ReactDOM from "react-dom";
import Mainpage from "./Components/Mainpage";
import ProductsGrid from './Components/ProductsGrid';
import ProductDetails from './Components/ProductDetails';
import AdminPage from './Components/AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  const [user, setUser] = React.useState("");
  const [userid, setUserid] = React.useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  return (
        <div>
          <UserContext.Provider value={{ user, setUser, userid, setUserid, isAdmin, setIsAdmin }}>
          <Router>
  <Routes>
    <Route exact path="/" element={<Mainpage />} />
    <Route path="/products" element={<ProductsGrid />} />
    <Route path="/products/details/:productId" element={<ProductDetails />} />
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
</Router>

          </UserContext.Provider>
        </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

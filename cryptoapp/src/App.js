import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Typography, Space } from "antd";

import {
  Homepage,
  Navbar,
  Cryptocurrencies,
  News,
  CryptoDetails,
  CryptoConverter,
} from "./components";

import "./App.css";
const App = () => {
  return (
    <div className="app">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="main">
        <Layout>
          <div className="routes">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
              <Route path="/crypto/:coinId" element={<CryptoDetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/converter" element={<CryptoConverter />} />
            </Routes>
          </div>
        </Layout>
        <div className="footer">
          <Typography.Title
            level={5}
            style={{ color: "white", textAlign: "center" }}
          >
            CryptoCrafter <br />
            All rights reserverd
          </Typography.Title>
          <Space>
            <Link to="/">Home</Link>
            <Link to="/news">Top Performance</Link>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default App;

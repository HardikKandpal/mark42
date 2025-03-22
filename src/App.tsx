import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PropertyPage } from './pages/PropertyPage';
import { ValuationPage } from './pages/ValuationPage';
import { MarketAnalysisPage } from './pages/MarketAnalysisPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import React from 'react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
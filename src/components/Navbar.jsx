import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg mb-3" style={{ backgroundColor: 'rgba(200, 200, 200, 0.5)' }}>
      <div className="container-fluid">
        <a className="navbar-brand ms-5" href="#">
          <img 
            src="/src/assets/img/logoStarWars-removebg-preview.png" 
            alt="LogoStarWars" 
            width="80" 
            height="80" 
            className="d-inline-block align-text-top"
          />
        </a>
        
        {/* Botón para mostrar/ocultar menú en dispositivos móviles */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Elementos del menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
            </li>
            <li className="nav-item">
              <Link to="/favoritos" className="nav-link">
                <button className="btn btn-outline-warning">
                  ⭐ Favoritos
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
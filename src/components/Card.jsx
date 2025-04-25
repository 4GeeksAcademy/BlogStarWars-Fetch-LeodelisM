import React from 'react';
import { Link } from 'react-router-dom';

export const Card = ({ title, text, imageUrl, id }) => {
    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={imageUrl || "https://placehold.co/600x400"} className="card-img-top" alt={title} />
            <div className="card-body">
                <h5 className="card-title ms-1">{title || "Card title"}</h5>
                <p className="card-text ms-1">{text || "Some quick example text to build on the card title and make up the bulk of the card's content."}</p>
                <div className="d-flex gap-2">
                    <Link to={`/single/${id}`} className="btn btn-outline-primary ms-1 me-2">Learn more!</Link>
                    <button className="btn btn-outline-warning ms-1">
                        ⭐ Favoritos
                    </button>
                </div>
            </div>
        </div>
    );
};
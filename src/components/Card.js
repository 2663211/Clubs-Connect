import React from 'react';
import PropTypes from 'prop-types'; // for type checking
import '../styles/Card.css';

export default function Card({ imageUrl, description }) {
  return (
    <section className="card">
      <section className="card-content">
        <img
          src={imageUrl}
          alt={description} // describe content only
          className="card-image"
        />
        <p className="card-description">{description}</p>
      </section>
    </section>
  );
}

// Optional: Prop type checking
Card.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types'; // for type checking
import '../styles/Card.css';

export default function Card({ imageUrl, description, onClick }) {
  return (
    <section
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <section className="card-content">
        <img
          src={props.image}
          alt="image describing content under"
          className="card-image"
        />
        <p className="card-description">{props.description}</p>
      </section>
    </section>
  );
}

// Optional: Prop type checking
Card.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

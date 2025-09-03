import React from 'react';
import '../styles/Card.css';
import props from 'prop-types';

export default function Card(props) {
  return (
    <section className="card">
      <section className="card-content">
        <img src={props.image} alt="image describing content under" className="card-image" />
        <p className="card-description">{props.description}</p>
      </section>
    </section>
  );
}

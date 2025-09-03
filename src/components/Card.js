<<<<<<< HEAD
import React from "react";
import "../styles/Card.css";
import props from "prop-types";
=======
import React from 'react';
import '../styles/Card.css';
import props from 'prop-types';
>>>>>>> origin/main

export default function Card(props) {
  return (
    <section className="card">
      <section className="card-content">
<<<<<<< HEAD
        <img
          src={props.image}
          alt="image describing content under"
          className="card-image"
        />
=======
        <img src={props.image} alt="Club logo" className="card-image" />
>>>>>>> origin/main
        <p className="card-description">{props.description}</p>
      </section>
    </section>
  );
}

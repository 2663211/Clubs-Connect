import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2023 Clubs Connect. All rights reserved.</p>
      <section className="footer-content">
        <h3>Contact Us</h3>
        <p>Tel Number: 123456780</p>
        <p>Email: 12345@wits.ac.za</p>
      </section>
      <section className="footer-links">
        <h3>Links</h3>
        <ul>
          <li>
            <a href="https://www.wits.ac.za/">Wits University</a>
          </li>
          <li>
            <a href="https://www.wits.ac.za/student-life/">Student Life</a>
          </li>
          <li>
            <a href="https://www.wits.ac.za/academics/">Academics</a>
          </li>
        </ul>
      </section>
      <section className="footer-social">
        <h3>Connect With Us</h3>
        <ul>
          <li>
            <a href="https://www.facebook.com/witsuniversity">Facebook</a>
          </li>
          <li>
            <a href="https://twitter.com/witsuniversity">Twitter</a>
          </li>
          <li>
            <a href="https://www.instagram.com/witsuniversity/">Instagram</a>
          </li>
        </ul>
      </section>
    </footer>
  );
}

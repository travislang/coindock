import React from 'react';
import './Footer.css'
import axios from 'axios';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const triggerPush = () => {
        setTimeout(() => {
            axios.post('/api/push/trigger-push/2')
        }, 3000)
    }

const Footer = () => (
  <footer>
    &copy; Prime Digital Academy
    <button onClick={triggerPush}>
        trigger push
    </button>
  </footer>
);

export default Footer;

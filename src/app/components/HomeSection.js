"use client";
import React, { useState, useEffect } from 'react';

export default function HomeSection() {
    const [message, setMessage] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        fetch('http://localhost:3001/')
            .then((response) => response.json())
            .then((data) => setMessage([data]))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <section>
            
        </section>
    );
}

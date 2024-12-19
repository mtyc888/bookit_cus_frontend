"use client";
import React, { useState, useEffect } from 'react';

export default function HomeSection() {
    const [message, setMessage] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        fetch('http://localhost:3001/appointments')
            .then((response) => response.json())
            .then((data) => setMessage(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <section>
            {/*Map through the JSON array and display each item*/}
            {message.length > 0 ? (
                <ul>
                    {message.map((item) => (
                        <li key={item.id}>
                            <p>{item.name} {item.phoneNo}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Non</p>
            )}
        </section>
    );
}

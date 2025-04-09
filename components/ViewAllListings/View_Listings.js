import React, { useEffect, useState } from 'react';
import ListingView from '../common/ListingView/ListingView';
import './View_Listings.css';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/listing/');
                if (!response.ok) {
                    throw new Error('Failed to fetch listings');
                }
                const data = await response.json();
                setListings(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="listings">
            {error && <div className="error">{error}</div>}
            {listings.length === 0 ? (
                <div>No listings available.</div>
            ) : (
                <ul className="listings-list">
                    {listings.map(listing => (
                        <li key={listing._id} className="listing-item">
                            <ListingView listing={listing} isFav={false} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Listings;

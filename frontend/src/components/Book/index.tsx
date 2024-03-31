import React from 'react';
import { Club } from '..';

interface BookProps {
    title: string;
    author: string;
    coverImageUrl: string;
    description: string;
    reviews: string[];
    purchaseLinks: { name: string; url: string }[];
    currentClubs: string[];
}

function Book({ title, author, coverImageUrl, description, reviews, purchaseLinks, currentClubs }: BookProps) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <img src={coverImageUrl} alt={title} className="book-cover" />
                </div>
                <div className="col-md-8">
                    <h2>{title}</h2>
                    <h3>Author: {author}</h3>
                    <p>{description}</p>
                    <h4>Reviews</h4>
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index}>{review}</li>
                        ))}
                    </ul>
                    <h4>Purchase Links</h4>
                    <ul>
                        {purchaseLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <h4>Current Clubs Reading this Book</h4>
                    <ul>
                        {currentClubs.map((club, index) => (
                            <li key={index}>{club}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Book;
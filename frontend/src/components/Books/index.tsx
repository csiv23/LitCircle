import React from 'react';
import './index.css';
import { Book } from '../types';

function Books({ book } : {
    book: Book
}) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <img className="book-cover-lg"
                        src={require(`../images/${book.coverImage}`)} alt={book.title} />
                </div>
                <div className="col-md-8">
                    <h2>{book.title}</h2>
                    <h3>Author: {book.author}</h3>
                    <p>{book.description}</p>
                    <h4>Reviews</h4>
                    <ul>
                        {/* {book.reviews.map((review, index) => (
                            <li key={index}>{review}</li>
                        ))} */}
                    </ul>
                    <h4>Purchase Links</h4>
                    <ul>
                        {book.purchaseLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <h4>Current Clubs Reading this Book</h4>
                    {/* <ul>
                        {book.currentClubs.map((club, index) => (
                            <li key={index}>
                                <div>
                                    <h5>{club.name}</h5>
                                    <p>Members: {club.members}</p>
                                    <img className="club-cover"
                                        src={require(`../images/${club.clubImage}`)} alt={club.name} />
                                </div>
                            </li>
                        ))}
                    </ul> */}
                </div>
            </div>
        </div>
    );
}

export default Books;
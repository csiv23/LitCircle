import React from 'react';
import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import './App.css';
import Profile from './components/Profile';
import BookClub from './components/BookClub';
import Book from './components/Book';

function App() {
  const bookData = {
    title: "Sample Book Title",
    author: "John Doe",
    coverImageUrl: "sample_cover.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan leo eu lorem tincidunt, eget fringilla nulla tincidunt. Duis vel ex vel sem fermentum tincidunt nec nec dolor.",
    reviews: ["Great book!", "Highly recommended."],
    purchaseLinks: [
        { name: "Amazon", url: "https://www.amazon.com/sample-book" },
        { name: "Barnes & Noble", url: "https://www.barnesandnoble.com/sample-book" }
    ],
    currentClubs: ["Best Friends Reading"]
  };
  return (
    // <HashRouter>
    //   <div>
    //     <Routes>
    //       <Route path="/" element={<Navigate to="profile"/>} />
    //       <Route path="profile" element={<Profile firstName="John" lastName="Doe" />} />
    //       <Route path="bookclub" element={<BookClub />} />
    //     </Routes>
    //   </div>
    // </HashRouter>
    <div>
      <Book 
                title={bookData.title}
                author={bookData.author}
                coverImageUrl={bookData.coverImageUrl}
                description={bookData.description}
                reviews={bookData.reviews}
                purchaseLinks={bookData.purchaseLinks}
                currentClubs={bookData.currentClubs}
        />
    </div>
  );
}

export default App;

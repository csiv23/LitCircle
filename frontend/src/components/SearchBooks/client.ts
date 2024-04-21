import axios from "axios";
import { Book } from "../types";

// TODO : MOVE THIS TO BACKEND ENV 
// const API_KEY = process.env.BOOKS_API_KEY;
const API_KEY = process.env.REACT_APP_BOOKS_API_KEY
const GOOGLE_BOOKS_URL = process.env.REACT_APP_GOOGLE_BOOKS_URL 

function cleanBookObj (bookData: any) : Book {
  let bookClean = {
      _id: "",
      googleBooksId: "",
      title: "Untitled",
      author: "N/A",
      description: "N/A",
      coverImageUrl: "",
      clubsReading: [],
  }

  if (bookData.id) {
    bookClean.googleBooksId = bookData.id;
  }

  if (bookData.volumeInfo.title) {
    bookClean.title = bookData.volumeInfo.title;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (bookData.volumeInfo.subtitle) {
    bookClean.description = bookData.volumeInfo.subtitle;
  }

  if (bookData.volumeInfo.authors && bookData.volumeInfo.authors.length > 0) {
    bookClean.author = bookData.volumeInfo.authors[0];
  }

  if (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) {
    bookClean.coverImageUrl = bookData.volumeInfo.imageLinks.thumbnail;
  }

  return bookClean;
}

export const searchBooks = async (title: string) => {
    const response = await axios
      .get(`${GOOGLE_BOOKS_URL}/volumes?q=${title}&orderBy=relevance&maxResults=40&key=${API_KEY}`);

    response.data.items = response.data.items.map(cleanBookObj);
    console.log(response);
    return response.data;
};  

export const getBookDetails= async (volumeId: string) => {
  const response = await axios
    .get(`${GOOGLE_BOOKS_URL}/volumes/${volumeId}?key=${API_KEY}`);
    console.log(response.data);
  return cleanBookObj(response.data);
};  
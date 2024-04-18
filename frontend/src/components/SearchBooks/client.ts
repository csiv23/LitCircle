import axios from "axios";
import { BookProps } from "../Books";

// TODO : MOVE THIS TO BACKEND ENV 
// const API_KEY = process.env.BOOKS_API_KEY;
const API_KEY = "AIzaSyBcnaenOTl-FLXJc3vyE_LSR3mwKa_u3Us"
const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1"

function cleanBookObj (bookData: any) : BookProps {
  let bookClean = {
      id: "",
      title: "",
      author: "",
      description: "N/A",
      coverImageUrl: "",
      currentClubs: [],
  }

  if (bookData.id) {
    bookClean.id = bookData.id;
  }

  if (bookData.volumeInfo.title) {
    bookClean.title = bookData.volumeInfo.title;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (bookData.volumeInfo.description) {
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
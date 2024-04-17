import axios from "axios";
import { BookProps } from "./components/Book";
import { User } from "./components/types";

// TODO : MOVE THIS TO BACKEND ENV 
// const API_KEY = process.env.BOOKS_API_KEY;
const API_KEY = "AIzaSyBcnaenOTl-FLXJc3vyE_LSR3mwKa_u3Us"
const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1"
const MONGOOSE_URL = "http://localhost:4000/api"

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

const axiosWithCredentials = axios.create({
  withCredentials: true,
 });
 

 export const getUsers = async () => {
  try {
    const url = `${MONGOOSE_URL}/users`;
    // const response = await fetch(url);


    const response = await axiosWithCredentials.get(`${MONGOOSE_URL}/users`);
    // console.log(response.json());
    // return response.json();
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Consider throwing the error or handling it appropriately
    throw error;
  }
};

// Only updates the 
export const updateUserProfile = async (mongoId: string, uid: string, email: string, password: string, username: string) => {
  try {
    console.log("GOT the _id: " + mongoId);
    console.log("GOT the uid: " + uid);
    // Update the user in mongoDB
    const response = await axios.patch(`${MONGOOSE_URL}/users/${mongoId}`, {email, password, username}); // {email: email, password: password}
    console.log("updateUserProfile: " + response.data);
    // TODO: Update the user in firebase. We only need to update the email and password
    // Call firebase.ts client functions to update email and password
    return response.data;
  }
  catch (error) {
    console.error("Failed to update user profile: ", error);
    throw error;
  }
}; 

// export const updateUserProfile = async (user: User) => {
//   try {
//     console.log("GOT the user: " + JSON.stringify(user));
//     const response = await axios.patch(`${MONGOOSE_URL}/users/${user.userId}`);
//     console.log("updateUserProfile: " + response.data);
//     // TODO: Update the firebase database
//     return response.data;
//   }
//   catch (error) {
//     console.error("Failed to update user profile: ", error);
//     throw error;
//   }
// }; 
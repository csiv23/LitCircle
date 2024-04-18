import axios from "axios";
import { Book, ObjectId, User } from "./components/types";
// TODO : MOVE THIS TO BACKEND ENV 
const MONGOOSE_URL = "http://localhost:4000/api"

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

function cleanBookObj (bookData: any) : Book {
  let bookClean = {
    _id: "",
    title: "",
    author: "",
    coverImageUrl: "",
    description: "",
    clubsReading: [],
  }

  if (bookData._id) {
    bookClean._id = bookData.id;
  }

  if (bookData.Title) {
    bookClean.title = bookData.Title;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (bookData.Description) {
    bookClean.description = bookData.Description;
  }

  if (bookData.Author) {
    bookClean.author = bookData.Author;
  }

  if (bookData.CoverImageUrl) {
    bookClean.coverImageUrl = bookData.CoverImageUrl;
  }

  if (bookData.ClubsReading) {
    bookClean.clubsReading = bookData.CoverImageUrl;
  }

  return bookClean;
}

function cleanUser (userData: any) : User {
  let userClean = {
    _id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    followers: [],
    following: [],
    wishlist: [],
    booksRead: [],
    bookClubs: [],
    avatar: "",
  }

  if (userData._id) {
    userClean._id = userData._id;
  }

  if (userData.Username) {
    userClean.username = userData.Username;
  }

  if (userData.FirstName) {
    userClean.firstName = userData.FirstName;
  }

  if (userData.LastName) {
    userClean.lastName = userData.LastName;
  }

  if (userData.Email) {
    userClean.email = userData.Email;
  }

  if (userData.Password) {
    userClean.password = userData.Password;
  }

  if (userData.Following) {
    userClean.following = userData.Following;
  }

  if (userData.Followers) {
    userClean.followers = userData.Followers;
  }

  if (userData.Wishlist) {
    userClean.wishlist = userData.Wishlist;
  }

  if (userData.BooksRead) {
    userClean.booksRead = userData.BooksRead;
  }

  if (userData.BookClubs) {
    userClean.bookClubs = userData.BookClubs;
  }

  if (userData.AvatarUrl) {
    userClean.avatar = userData.AvatarUrl;
  }

  return userClean;
}

export async function mongooseGet(uri : string) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      const response = await axios.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Mongoose request failed at ${url}`, error);
      throw error;
  }
}

export async function mongooseGetCredentials(uri : string) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      const response = await axiosWithCredentials.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Mongoose request failed at ${url}`, error);
      throw error;
  }
}

export async function notImplemented() {
  console.log("not implemented yet")
}

// export const getUsers = mongooseCallCredentials(`${MONGOOSE_URL}/users`);
 export const getUsers = async () => {
  const response = await mongooseGetCredentials('/users');
  return response.Users};

 // implement this 
 export const getUserById = async (userId : ObjectId) => {return await notImplemented()}

  // implement this 
  export const getBookById = async (bookId : ObjectId) => {
    const response = await mongooseGet(`books/${bookId}`);
    return cleanBookObj(response);
  }

  export const getBooksReadByClub = async (clubId : ObjectId) => {
    const response = await mongooseGet(`clubs/${clubId}/booksRead`);
    return response.BooksRead.map(cleanBookObj);
  }

  export const getWishlistByClub = async (clubId : ObjectId) => {
    const response = await mongooseGet(`clubs/${clubId}/wishlist`);
    return response.Wishlist.map(cleanBookObj);
  }


  export const getMembersByClub = async (clubId : ObjectId) => {
    const response = await mongooseGet(`clubs/${clubId}/members`);
    return response.Members.map(cleanUser);
  }

 export const getBookClubById = async (clubId : ObjectId) => {
  const response = await mongooseGet(`clubs/${clubId}`);
  return cleanBookObj(response);
}

export const getClubOrganizer = async (clubId : ObjectId) => {
  const response = await mongooseGet(`clubs/${clubId}/organizer`);
  return cleanUser(response);
}

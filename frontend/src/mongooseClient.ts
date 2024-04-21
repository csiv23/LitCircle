import axios from "axios";
import { Book, Club, ObjectId, User } from "./components/types";

// TODO : MOVE THIS TO BACKEND ENV 
const MONGOOSE_URL = process.env.REACT_APP_MONGOOSE_URL;
const USERS_API_URL = `${MONGOOSE_URL}/users`
axios.defaults.withCredentials = true

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

function cleanBookObj (bookData: any) : Book {
  let bookClean = {
    _id: "",
    googleBooksId: "",
    title: "Untitled",
    author: "N/A",
    coverImageUrl: "",
    description: "N/A",
    clubsReading: [],
  }

  if (bookData._id) {
    bookClean._id = bookData._id;
  }

  if (bookData.GoogleBooksId) {
    bookClean.googleBooksId = bookData.GoogleBooksId;
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
    bookClean.clubsReading = bookData.ClubsReading;
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

function cleanClub (clubData : any) : Club {
  let clubClean = {
    _id: "",
    name: "",
    description: "",
    members: [],
    booksRead: [],
    wishlist: [],
    currentBook: "",
    nextMeeting: {
      meetingDate: new Date(),
      location: ""
    },
    organizer: "",
    imageUrl: ""
  }

  if (clubData._id) {
    clubClean._id = clubData._id;
  }

  if (clubData.Name) {
    clubClean.name = clubData.Name;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (clubData.Description) {
    clubClean.description = clubData.Description;
  }

  if (clubData.Members) {
    clubClean.members = clubData.Members;
  }

  if (clubData.BooksRead) {
    clubClean.booksRead = clubData.Wishlist;
  }

  if (clubData.Wishlist) {
    clubClean.wishlist = clubData.Wishlist;
  }


  if (clubData.CurrentBook) {
    clubClean.currentBook = clubData.CurrentBook;
  }

  if (clubData.ImageUrl) {
    clubClean.imageUrl = clubData.ImageUrl;
  }


  if (clubData.NextMeeting 
    && clubData.NextMeeting.meetingDate
    && clubData.NextMeeting.location ) {
    clubClean.nextMeeting = clubData.NextMeeting;
  }

  if (clubData.Organizer) {
    clubClean.organizer = clubData.Organizer;
  }

  return clubClean;
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

/**
 * Posts data to a specified MongoDB endpoint using Axios.
 * @param {string} uri - The URI endpoint to post data to.
 * @param {any} params - The payload to send in the POST request.
 * @returns {Promise<any>} The response data from the server.
 */
export async function mongoosePost(uri : string, params : any) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      // Attempt to send a POST request using Axios
      const response = await axios.post(url, params);
      console.log("Response received:", response.data);
      return response.data;
  } catch (error : any) {
      // Log detailed error information
      if (error.response) {
          // The server responded with a status code that is not in the range of 2xx
          console.error(`Server responded with non-2xx status: ${error.response.status}`, { detail: error.response.data });
      } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from server.", { detail: error.request });
      } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error setting up the request:", error.message);
      }

      // Re-throw the error to handle it further up the call stack
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

 export const getUsers = async () => {
  const response = await mongooseGetCredentials('users');
  return response
};

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

  export const getClubCurrentBook = async (clubId : ObjectId) => {
    const response = await mongooseGet(`clubs/${clubId}/currentBook`);
    return cleanBookObj(response.CurrentBook);
  }

  export const getMembersByClub = async (clubId : ObjectId) => {
    const response = await mongooseGet(`clubs/${clubId}/members`);
    return response.Members.map(cleanUser);
  }

 export const getBookClubById = async (clubId : ObjectId) => {
  const response = await mongooseGet(`clubs/${clubId}`);
  return cleanClub(response);
}

export const getClubOrganizer = async (clubId : ObjectId) => {
  const response = await mongooseGet(`clubs/${clubId}/organizer`);
  return cleanUser(response.Organizer);
}

export const createBook = async (book : Book) => {
  const response = await mongoosePost(`books/`, book);
  return response.bookId;
}

export const getClubsReadingPerBook = async (bookId : ObjectId) => {
  const response = await mongooseGet(`books/${bookId}/clubsReading`);
  return response.ClubsReading.map(cleanClub);
}

export const searchBookclubs = async (name : string) => {
  const response = await mongooseGet(`clubs/search?name=${name}`);
  return response.map(cleanClub);
}

// signin only requires email and password
export const signin = async (credentials: any) => {
  const response = await axios.post(`${USERS_API_URL}/login`, credentials);
  return cleanUser(response.data);
}

export const signup = async (credentials: User) => {
  const response = await axios.post(`${USERS_API_URL}/register`, credentials);
  return cleanUser(response.data);
}

export const signout = async () => {
  const response = await axios.post(`${USERS_API_URL}/signout`);
  return response.data;
};

export const profile = async () => {
  const response = await axios.post(`${USERS_API_URL}/profile`);
  return cleanUser(response.data);
}

export const updateUserProfile = async (id: string | undefined, username: string, password: string) => {
  try {
    const response = await axios.patch(`${MONGOOSE_URL}/users/${id}`, {username, password});
    console.log("updateUserProfile: " + response.data);
    return cleanUser(response.data);
  }
  catch (error) {
    console.error("Failed to update user profile: ", error);
    throw error;
  }
};



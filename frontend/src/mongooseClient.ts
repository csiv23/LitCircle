import axios from "axios";
import { Book, Club, ObjectId, User } from "./components/types";

// TODO : MOVE THIS TO BACKEND ENV 
const MONGOOSE_URL = process.env.REACT_APP_MONGOOSE_URL || "http://localhost:4000/api"
const USERS_API_URL = `${MONGOOSE_URL}/users`
axios.defaults.withCredentials = true

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

type MongooseClub = {
  _id : string,
  Name : string,
  Description : string,
  Members : string[],
  BooksRead : string[],
  Wishlist : string[],
  CurrentBook : string,
  NextMeeting : {
    Date : string,
    Location : string
  },
  ImageUrl : string,
  Organizer : string
}

function cleanBookObj(bookData: any): Book {
  let bookClean = {
      _id: "",
      googleBooksId: "",
      title: "Untitled",
      author: "N/A",
      coverImageUrl: "",
      description: "N/A",
      clubsReading: [],
  };

  // Check if bookData is not null before accessing its properties
  if (bookData && bookData._id) {
      bookClean._id = bookData._id;
  }

  if (bookData && bookData.GoogleBooksId) {
      bookClean.googleBooksId = bookData.GoogleBooksId;
  }

  if (bookData && bookData.Title) {
      bookClean.title = bookData.Title;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (bookData && bookData.Description) {
      bookClean.description = bookData.Description;
  }

  if (bookData && bookData.Author) {
      bookClean.author = bookData.Author;
  }

  if (bookData && bookData.CoverImageUrl) {
      bookClean.coverImageUrl = bookData.CoverImageUrl;
  }

  if (bookData && bookData.ClubsReading) {
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
      location: "No location specified"
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
    clubClean.booksRead = clubData.BooksRead;
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
    && clubData.NextMeeting.Date
    && clubData.NextMeeting.Location ) {
      console.log(clubData.NextMeeting.Date);
    clubClean.nextMeeting = {
      
      location: clubData.NextMeeting.Location,
      meetingDate: new Date(clubData.NextMeeting.Date)
    }
  }

  if (clubData.Organizer) {
    clubClean.organizer = clubData.Organizer;
  }

  return clubClean;
}

function cleanClubMongoose(clubData : Club) : MongooseClub {
  let currentDate = new Date();
  let clubClean : MongooseClub = {
    _id: "",
    Name: "",
    Description: "",
    Members: [],
    BooksRead: [],
    Wishlist: [],
    CurrentBook: "",
    NextMeeting: {
      Date: "",
      Location: "No location specified"
    },
    Organizer: "",
    ImageUrl: ""
  }

  if (clubData._id) {
    clubClean._id = clubData._id;
  }

  if (clubData.name) {
    clubClean.Name = clubData.name;
  }

  // TODO: EMBED HTML FROM DESCRIPTION? 
  if (clubData.description) {
    clubClean.Description = clubData.description;
  }

  if (clubData.members) {
    clubClean.Members = clubData.members;
  }

  if (clubData.booksRead) {
    clubClean.BooksRead = clubData.booksRead;
  }

  if (clubData.wishlist) {
    clubClean.Wishlist = clubData.wishlist;
  }

  if (clubData.currentBook) {
    clubClean.CurrentBook = clubData.currentBook;
  }

  if (clubData.imageUrl) {
    clubClean.ImageUrl = clubData.imageUrl;
  }


  if (clubData.nextMeeting 
    && clubData.nextMeeting.meetingDate
    && clubData.nextMeeting.location ) {
    clubClean.NextMeeting = {
      Location: clubData.nextMeeting.location,
      Date: clubData.nextMeeting.meetingDate.toISOString()
    }
  }

  if (clubData.organizer) {
    clubClean.Organizer = clubData.organizer;
  }

  return clubClean;
}


export async function mongooseGet(uri : string, body = {}) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      const response = await axios.get(url, body);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Mongoose request failed at ${url}`, error);
      throw error;
  }
}

export async function mongoosePatch(uri : string, params : any) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      const response = await axios.patch(url, params);
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
export async function mongoosePost(uri : string, params={}) {
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

export async function mongooseDelete(uri : string, params={}) {
  const url = `${MONGOOSE_URL}/${uri}`;
  try {
      const response = await axios.delete(url, params);
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
  return response.map(cleanUser);
};

 // implement this 
 export const getUserById = async (userId : ObjectId) => {
  const response = await mongooseGet(`users/${userId}`);
  return cleanUser(response);
 }

export const getBooks = async () => {
  const response = await mongooseGet(`books`);
  return response.map(cleanBookObj);
}

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
  const reformattedClub = response._doc ? {...response._doc, NextMeeting: response.NextMeeting} : response

  return cleanClub(reformattedClub);
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

export const getClubs = async () => {
  const response = await mongooseGet('clubs');
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

export const updateUserProfile = async (id: string | undefined, username: string | undefined, password: string | undefined) => {
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

export const addToClubWishlist = async (clubId : string, bookId : string) => {
  const response = await mongoosePost(`clubs/${clubId}/wishlist`, {bookId : bookId})
  return response;
}

export const getUserWishlist = async (userId : string) => {
  console.log("getUserWishlist")
  const response = await mongooseGet(`users/${userId}/wishlist`)
  console.log("response: " + JSON.stringify(response))
  return response.map(cleanBookObj);
}

export const addToWishlist = async (userId : string, bookId : string) => {
  const response = await mongoosePatch(`users/${userId}/wishlist`, {bookId : bookId})
  return cleanUser(response);
}

export const addToBooksRead = async (userId : string, bookId : string) => {
  const response = await mongoosePatch(`users/${userId}/booksread`, {bookId : bookId})
  return cleanUser(response);
}

export const removeFromWishlist = async (userId : string, bookId : string) => {
  const response = await mongoosePost(`users/${userId}/wishlist-delete`, {bookId : bookId})
  return cleanUser(response);
}

export const removeFromBooksRead = async (userId : string, bookId : string) => {
  const response = await mongoosePost(`users/${userId}/booksread-delete`, {bookId : bookId})
  return cleanUser(response);
}

export const recommendBookToClub = async (clubId : string, bookId : string) => {
  const response = await mongoosePost(`clubs/${clubId}/recommendBook`, {bookId : bookId});
  return response.Wishlist; 
}

export const getUserClubsWithoutBookRec = async (userId : string, bookId : string) => {
  const response = await mongooseGet(
    `users/${userId}/clubsWithoutRec/${bookId}`);
  return response.map(cleanClub);
}

export const followUser = async (userId: string, userIdToFollow: string) => {
  try {
    const response = await axios.patch(`${USERS_API_URL}/${userId}/follow`, {userIdToFollow: userIdToFollow});
    return cleanUser(response.data);
  } catch (error) {
    console.log("Already following this user!")
  }
}

export const unfollowUser = async (userId: string, userIdToUnfollow: string) => {
  try {
    const response = await axios.patch(`${USERS_API_URL}/${userId}/unfollow`, {userIdToFollow: userIdToUnfollow});
    return cleanUser(response.data);
  } catch (error) {
    console.log("Already unfollowed this user!")
  }
}

export const getRecentUsers = async () => {
  const response = await mongooseGet('homepage/recent-users');
  return response.map(cleanUser);
};

export const getNewFollowers = async (userId: string) => {
  const response = await mongooseGet(`homepage/${userId}/newfollowers`);
  return response.map(cleanUser);
};

export const getUserNextMeetings = async (userId: string) => {
  const response = await mongooseGet(`users/${userId}/nextmeetings`);
  console.log(response);
  return response;  
};

export const leaveClub = async (clubId : string, userId : string) => {
  const response = await mongoosePost(
    `clubs/${clubId}/leave`,
    { userId : userId}
  );
  return response; 
}

export const joinClub = async (clubId : string, userId : string) => {
  const response = await mongoosePost(
    `clubs/${clubId}/join`,
    { userId : userId}
  );
  return response; 
}

export const updateClub = async (club : Club) => {
  const clubMongoose = cleanClubMongoose(club);

  const updatedClub = await mongoosePatch(`clubs/${club._id}`, {data: clubMongoose});
  return cleanClub(updatedClub.club);
}

export const setCurrentBook = async (clubId : string, bookId : string) => {
  const updatedClub = await mongoosePost(`clubs/${clubId}/setCurrentBook`, {bookId : bookId});
  return cleanClub(updatedClub.club);
}

export const markCurrentBookAsRead = async (clubId : string) => {
  const updatedClub = await mongoosePost(`clubs/${clubId}/markCurrentBookAsRead`);
  return cleanClub(updatedClub.club);
}

export const removeBookFromClubWishlist = async (clubId : string, bookId : string) => {
  const updatedClub = await mongooseDelete(`clubs/${clubId}/wishlist`, {bookId : bookId});
  return cleanClub(updatedClub.club);
}
// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { User } from "../components/types";
// const usersSlice = createSlice({
//  name: "users",
//  initialState: { currentUser: null },
//  reducers: {
//    setCurrentUser: (state, action: PayloadAction<User | null>) => {
//     state.currentUser = action.payload;
//    },
//  },
// });
// export const { setCurrentUser } = usersSlice.actions;
// export default usersSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../components/types";

// Define the initial state
interface UsersState {
  currentUser: User | null;
}
// Set the initial state
const initialState: UsersState = {
  currentUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
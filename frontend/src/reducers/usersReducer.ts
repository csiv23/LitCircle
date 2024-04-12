import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
 name: "users",
 initialState: { currentUser: null },
 reducers: {
   setCurrentUser: (state, action) => {
     state.currentUser = action.payload;
   },
 },
});
export const { setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
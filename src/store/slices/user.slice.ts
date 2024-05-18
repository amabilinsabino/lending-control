import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface UserState {
  id: number;
  name: string;
  document: string;
}

const initialState: UserState | null = null;

export const getUserFromApi = createAsyncThunk(
  "login",
  async (document: string) => {
    const response = await axios.get(`/api/login/${document}`);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser() {
      return null;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserFromApi.fulfilled, (state: any, action) => {
      console.log({ state, action: action.payload });

      state = action.payload;
      return state;
    });
  },
});

export const getUser = (state: RootState) => state.user;
export const { resetUser } = userSlice.actions;

export default userSlice.reducer;

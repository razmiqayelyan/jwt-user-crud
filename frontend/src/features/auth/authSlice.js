import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "./authService";


export const user = JSON.parse(localStorage.getItem("user"))

export const authState = (state) => state.auth

const initialState = {
    user: user? user : null,
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:""
}





export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
        
    }
})

export const userInfo = createAsyncThunk('auth/info', async(user, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user
    return await authService.userInfo(token)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk("auth/login", async(myUser, thunkAPI) => {
    try {
        return await authService.login(myUser)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk("auth/logout", async(thunkAPI) => {
    try {
        return await authService.logout()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset : (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""  
            state.data = {}     
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(register.pending, (state) => {
            state.isLoading = true
          })
          .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.data = action.payload
          })
          .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
            localStorage.removeItem(user)
          })
          .addCase(login.pending, (state) => {
            state.isLoading = true
          })
          .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.data = action.payload
          })
          .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
          })
          .addCase(logout.pending, (state) => {
            state.isLoading = true
          })
          .addCase(logout.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.data = null
          })
          .addCase(logout.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
          })
          .addCase(userInfo.pending, (state) => {
            state.isLoading = true
          })
          .addCase(userInfo.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.data = action.payload
            state.isError = false
          })
          .addCase(userInfo.rejected, (state, action) => {
            state.isLoading = false
            state.message = action.payload
            state.user = null
            state.data = null
          })
        }
}) 


export const {reset} = authSlice.actions 
export default authSlice.reducer
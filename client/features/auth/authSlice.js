import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    loading:false,
    user:null,
    error:null,
}


export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(signUp.pending,(state)=>{
            state.loading = true
        });
        builder.addCase(signUp.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload
        });
        builder.addCase(signUp.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload
        })
    }
})


export const signUp = createAsyncThunk('signUp',async (apiData,{rejectWithValue})=>{
    try {
        const {data} = await axios.post('http://localhost:4000/api/user',apiData)
        return data
    } catch (error) {
        if(error?.response?.data?.message){
            return rejectWithValue(error?.response?.data?.message)
        }else{
            return rejectWithValue('Some Error Occured')
        }
    }
})
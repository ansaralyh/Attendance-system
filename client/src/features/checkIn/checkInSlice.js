import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'



const initialState = {
    loading: false,
    error: null,
    data: null,
    checkInLoading: false,
    checkInSuccess: false,
    checkInError: null,
    checkOutLoading: false,
    checkOutError: null,
    checkOutSuccess: false,
}

export const checkInSlice = createSlice({
    name: 'CheckIn',
    initialState,
    reducers: {
            
    },
    extraReducers: (builder) => {
        builder.addCase(addCheckIn.pending, (state) => {
            state.checkInLoading = true
        })
        builder.addCase(addCheckIn.fulfilled, (state) => {
            state.checkInLoading = false;
            state.checkInSuccess = true;
        })
        builder.addCase(addCheckIn.rejected, (state, action) => {
            state.checkInLoading = false;
            state.checkInError = action.payload
        })

        builder.addCase(getCheckInOutData.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getCheckInOutData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        })
        builder.addCase(getCheckInOutData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })
        builder.addCase(addCheckOut.pending, (state) => {
            state.checkOutLoading = true;
        })
        builder.addCase(addCheckOut.fulfilled, (state, action) => {
            state.checkOutLoading = false;
            state.checkOutSuccess = action.payload
        })
        builder.addCase(addCheckOut.rejected, (state, action) => {
            state.checkOutLoading = false;
            state.checkOutError = action.payload
        })


    }
})

export const addCheckIn = createAsyncThunk('addCheckin', async (apiData, { rejectWithValue }) => {
    try {
        if (!apiData.token) {
            return rejectWithValue("Unauthorized - Please Provide token")
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id")
        }

        const { data } = await axios.post(`http://localhost:4000/api/user/checkIn/${apiData.id}`, {
            headers: {
                'Authorization': `Bearer ${apiData.token}`
            }
        })
        // console.log(data)
        return data
    } catch (error) {
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message)
        } else {
            return rejectWithValue("Some Error occured")
        }
    }
})
export const addCheckOut = createAsyncThunk('addCheckout', async (apiData, { rejectWithValue }) => {
    try {
        if (!apiData.token) {
            return rejectWithValue("Unauthorized - Please Provide token")
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id")
        }

        console.log(apiData)

        const { data } = await axios.post(`http://localhost:4000/api/user/checkOut/${apiData.id}`, {
            headers: {
                'Authorization': `Bearer ${apiData.token}`
            }
        })
        // console.log(data)
        return data
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message)
        } else {
            return rejectWithValue("Some Error occured")
        }
    }
})
export const getCheckInOutData = createAsyncThunk('getCheckinout', async (apiData, { rejectWithValue }) => {
    try {
        if (!apiData.token) {
            return rejectWithValue("Unauthorized - Please Provide token")
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id")
        }

        const { data } = await axios.get(`http://localhost:4000/api/user/getSingleUser/${apiData.id}`, {
            headers: {
                'Authorization': `Bearer ${apiData.token}`
            }
        })
        // console.log(data)
        return data
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message)
        } else {
            return rejectWithValue("Some Error occured")
        }
    }
})


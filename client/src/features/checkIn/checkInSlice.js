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
        clearCheckInState: (state) => {
            state.checkInSuccess = false;
            state.checkInError = null;
            state.checkOutSuccess = false;
            state.checkOutError = null;
        }
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
        builder.addCase(addCheckOut.fulfilled, (state) => {
            state.checkOutLoading = false;
            state.checkOutSuccess = true;
        })
        builder.addCase(addCheckOut.rejected, (state, action) => {
            state.checkOutLoading = false;
            state.checkOutError = action.payload
        })
    }
})

export const addCheckIn = createAsyncThunk('checkIn/addCheckIn', async (apiData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue("Unauthorized - Please login again");
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id");
        }

        const { data } = await axios.post(`http://localhost:8080/api/user/checkIn/${apiData.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message);
        } else {
            return rejectWithValue("Some Error occurred");
        }
    }
});

export const addCheckOut = createAsyncThunk('checkIn/addCheckOut', async (apiData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue("Unauthorized - Please login again");
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id");
        }

        const { data } = await axios.post(`http://localhost:8080/api/user/checkOut/${apiData.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message);
        } else {
            return rejectWithValue("Some Error occurred");
        }
    }
});

export const getCheckInOutData = createAsyncThunk('checkIn/getData', async (apiData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue("Unauthorized - Please login again");
        }
        if (!apiData.id) {
            return rejectWithValue("Please Provide id");
        }

        const { data } = await axios.get(`http://localhost:8080/api/user/getSingleUser/${apiData.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        if (error?.response?.data?.message) {
            return rejectWithValue(error?.response?.data?.message);
        } else {
            return rejectWithValue("Some Error occurred");
        }
    }
});

export const { clearCheckInState } = checkInSlice.actions;
export default checkInSlice.reducer;


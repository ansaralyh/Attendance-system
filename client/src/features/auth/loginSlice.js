import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const initialState = {
  loading: false,
  user: null,
  error: null,
  success: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem('token'); // Remove token on logout
    }
  },

  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
      state.error = null;
      // Store token in localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
  },
});

export const login = createAsyncThunk('auth/login', async (apiData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('http://localhost:8080/api/user/login', apiData);
    return data;
  } catch (error) {
    if (error?.response?.data?.message) {
      return rejectWithValue(error?.response?.data?.message);
    } else {
      return rejectWithValue('Some Error Occurred');
    }
  }
});

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  navigate('/empDashboard');
};

export const { clearState } = authSlice.actions;
export default authSlice.reducer;
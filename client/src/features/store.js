import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authSlice } from './auth/loginSlice'
import { checkInSlice } from './checkIn/checkInSlice'

const persistConfig = {
    key: 'root',
    storage
}


export const store = configureStore({
    reducer: {
        auth: persistReducer(persistConfig, authSlice.reducer),
        checkInOut: checkInSlice.reducer
    }
})

export const persistor = persistStore(store)
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authSlice } from './auth/loginSlice'

const persistConfig = {
    key: 'root',
    storage
}


export const store = configureStore({
    reducer: {
        auth: persistReducer(persistConfig, authSlice.reducer)
    }
})

export const persistor = persistStore(store)
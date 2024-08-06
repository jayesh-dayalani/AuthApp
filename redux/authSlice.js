import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        isAuthenticated: false,
        id: '',
        email: ''
    },
    reducers: {
        addAuthDetails: (state, action) => {
            state.isAuthenticated = true
            state.id = action.payload.id
            state.email = action.payload.email
        },
        removeAuthDetails: (state, action) => {
            state.isAuthenticated = false
            state.id = ''
            state.email = ''
        }
    },
})

export const { addAuthDetails, removeAuthDetails } = authSlice.actions
export default authSlice.reducer
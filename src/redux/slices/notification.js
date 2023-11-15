import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
}

const slice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setNotifications(state, action) {
            const new_message = action.payload;
            state.notifications.push(new_message);
        }
    }
});
// Reducer
export default slice.reducer;

export const setNotifications = (new_message) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.setNotifications(new_message));
    };
};

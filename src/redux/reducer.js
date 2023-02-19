import { createReducer } from "@reduxjs/toolkit";

export const authReducer = createReducer(
  {},
  {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.rol = "vendor";
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    loginClientRequest: (state) => {
      state.loading = true;
    },
    loginClientSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.rol = "user";
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    loginClientFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.loading = true;
      state.navigateLogin = false;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.navigateLogin = true;
      state.isAuthenticated = true;
      state.rol = "vendor";
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.navigateLogin = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    registerClientRequest: (state) => {
      state.loading = true;
      state.navigateLogin = false;
    },
    registerClientSuccess: (state, action) => {
      state.loading = false;
      state.navigateLogin = true;
      state.isAuthenticated = true;
      state.rol = "user";
      state.user = action.payload.user;
      state.message = action.payload.message;
    },
    registerClientFailure: (state, action) => {
      state.loading = false;
      state.navigateLogin = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loadUserFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.navigateLogin = false;
      state.message = action.payload.message;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    },
    deleteUserRequest: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.navigateLogin = false;
      state.message = action.payload.message;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  }
);

import axios from "axios";

export const serverUrl = "http://localhost:5000";

export const login = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "loginClientRequest" });
    const { data } = await axios.post(`${serverUrl}/user/login`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "loginClientSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "loginClientFailure",
      payload: error.response.data.message,
    });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "registerClientRequest" });
    const { data } = await axios.post(`${serverUrl}/user/register`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "registerClientSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "registerclientFailure",
      payload: error.response.data.message,
    });
  }
};

export const loadUser = (role) => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });
    const token = localStorage.getItem("token");
    if (!token)
      dispatch({
        type: "loadUserFailure",
      });
    const { data } = await axios.get(
      `${serverUrl}/${role === "user" ? "user" : "vendor"}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: "loadUserSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "loadUserFailure",
      payload: error.response.data?.message,
    });
  }
};

export const logout = (role) => async (dispatch) => {
  try {
    dispatch({ type: "logoutRequest" });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    const { data } = await axios.get(
      `${serverUrl}/${role === "user" ? "user" : "vendor"}/logout`,
      {
        withCredentials: true,
        credentials: "include",
      }
    );
    dispatch({ type: "logoutSuccess", payload: data });
    dispatch({ type: "logoutUrlSuccess" });
  } catch (error) {
    dispatch({ type: "logoutFailure", payload: error.response.data.message });
  }
};

export const deleteProfile =
  ({ id, password, role }) =>
  async (dispatch) => {
    try {
      dispatch({ type: "deleteUserRequest" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const { data } = await axios.delete(
        `${serverUrl}/${role === "user" ? "user" : "vendor"}/delete/${id}`,
        {
          data: { password },
        }
      );
      dispatch({ type: "logoutUrlSuccess" });
      dispatch({ type: "deleteUserSuccess", payload: data });
    } catch (error) {
      dispatch({
        type: "deleteUserFailure",
        payload: error.response.data.message,
      });
    }
  };

export const registerVendor = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "registerRequest" });
    const { data } = await axios.post(`${serverUrl}/user/register`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "registerSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "registerFailure",
      payload: error.response.data.message,
    });
  }
};
export const loginVendor = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "loginRequest" });
    const { data } = await axios.post(`${serverUrl}/vendor/login`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "loginSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "loginFailure",
      payload: error.response.data.message,
    });
  }
};

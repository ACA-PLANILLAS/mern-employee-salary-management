import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import LoginInput from "./index";
import { BrowserRouter } from "react-router-dom";

// Simular variables de entorno para Jest
process.env.VITE_API_URL = "http://localhost:3000";

// Mock de sweetalert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => Promise.resolve()),
}));

// Mock useTranslation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock de useErrorMessage
jest.mock("../../../../hooks/useErrorMessage", () => ({
  useErrorMessage: () => (msg) => msg,
}));

// Mock de loginUser
jest.mock("../../../../config/redux/action", () => ({
  loginUser: (data) => ({
    type: "LOGIN_USER",
    payload: data,
  }),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("LoginInput", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      },
    });
  });

  it("debe mostrar los inputs de usuario y contraseña", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginInput />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText("input.usernamePlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("input.passwordPlaceholder")).toBeInTheDocument();
  });

  it("debe despachar loginUser al enviar el formulario", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginInput />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText("input.usernamePlaceholder");
    const passwordInput = screen.getByPlaceholderText("input.passwordPlaceholder");
    const submitButton = screen.getByRole("button") || screen.getByDisplayValue("input.loginButton");

    fireEvent.change(usernameInput, { target: { value: "usuario" } });
    fireEvent.change(passwordInput, { target: { value: "contraseña" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: "LOGIN_USER",
        payload: { username: "usuario", password: "contraseña" },
      });
    });
  });
});
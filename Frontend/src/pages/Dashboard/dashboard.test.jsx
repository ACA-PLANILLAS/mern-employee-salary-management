import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import * as redux from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));
import { getMe } from '../../config/redux/action';
import { DefaultDashboard } from '../../components';

jest.mock('../../components', () => ({
  DefaultDashboard: () => <div data-testid="default-dashboard">Dashboard Content</div>
}));

jest.mock('../../config/redux/action', () => ({
  getMe: jest.fn(() => ({ type: 'GET_ME' }))
}));

// mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockStore = configureStore([thunk]);

describe('Dashboard component', () => {
  let store;
  let dispatchSpy;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isError: false
      }
    });

    redux.useDispatch.mockReturnValue(store.dispatch);

    dispatchSpy = jest.spyOn(redux, 'useDispatch');
    dispatchSpy.mockReturnValue(store.dispatch);
    mockNavigate.mockReset();
  });

  it('renders DefaultDashboard', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('default-dashboard')).toBeInTheDocument();
  });

  it('dispatches getMe on mount', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'GET_ME' });
  });

  it('redirects to login if isError is true', () => {
    const errorStore = mockStore({
      auth: {
        isError: true
      }
    });

    render(
      <Provider store={errorStore}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
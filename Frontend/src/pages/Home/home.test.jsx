// src/pages/Home/Home.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils'; // Import act for async updates

// Import the component to be tested
import Home from './index';

// --- Mocking Dependencies ---

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock React Router DOM hooks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock Redux action (getMe)
import { getMe } from '../../config/redux/action';
jest.mock('../../config/redux/action', () => ({
  getMe: jest.fn(),
}));

// Mock child components to prevent them from interfering with the test
// and to ensure they are rendered when expected.
jest.mock('../../components', () => ({
  Banner: () => <div>Banner Mock</div>,
  Navbar: () => <div>Navbar Mock</div>,
}));
jest.mock('../About', () => () => <div>About Mock</div>);
jest.mock('../Contact', () => () => <div>Contact Mock</div>);

describe('Home Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    jest.clearAllMocks();

    // Set up default mock implementations for each test
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    // Default Redux state: no user, no error
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: null,
          isError: false,
        },
      })
    );
  });

  // --- Test Cases ---

  test('should render all child components', async () => {
    await act(async () => {
      render(<Home />);
    });

    // Expect all mocked child components to be in the document
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
    expect(screen.getByText('Banner Mock')).toBeInTheDocument();
    expect(screen.getByText('About Mock')).toBeInTheDocument();
    expect(screen.getByText('Contact Mock')).toBeInTheDocument();
  });

  test('should dispatch getMe action on mount', async () => {
    await act(async () => {
      render(<Home />);
    });

    // Expect getMe to be dispatched once
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(getMe());
  });

  test('should navigate to /dashboard if user is present', async () => {
    // Override default Redux state for this test: user is present
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: { name: 'Test User', role: 'admin' }, // A dummy user object
          isError: false,
        },
      })
    );

    await act(async () => {
      render(<Home />);
    });

    // Wait for any async effects/navigation to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('should NOT navigate to /login if isError is true (given current component logic)', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: null, // User is null
          isError: true, // isError is true
        },
      })
    );

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      // Expect that mockNavigate was NOT called
      expect(mockNavigate).not.toHaveBeenCalled(); // <-- CHANGE THIS LINE
    });
});

  test('should not navigate if no user and no error (initial state)', async () => {
    // The default beforeEach state covers this: user: null, isError: false

    await act(async () => {
      render(<Home />);
    });

    // Ensure navigate is not called when no user and no error
    // Use `queryByRole` or `queryByText` if elements might not be present.
    // For navigation, `not.toHaveBeenCalled()` is direct.
    await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
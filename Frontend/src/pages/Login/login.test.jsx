// src/pages/Login/Login.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the component to be tested
import Login from './index'; // Assuming 'index.jsx' is the file for your Login component

// --- Mocking Dependencies ---

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    // 't' function will return the key itself for easy assertion
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock child components
// This prevents errors if they have their own complex logic or dependencies
// and allows us to focus on testing the Login component itself.
jest.mock('../../components', () => ({
  Navbar: () => <div>Navbar Mock</div>,
  LoginInput: () => <div>LoginInput Mock</div>,
  Footer: () => <div>Footer Mock</div>,
}));

// Mock image imports
// Jest needs to know how to handle image imports. By default, it might error.
// We'll mock them to return simple string paths, as their content isn't relevant to the test.
jest.mock('../../assets/images/logo/logo-sipeka.png', () => 'logo-sipeka.png');
jest.mock('../../assets/images/LoginImg/login.svg', () => 'login.svg');


describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    jest.clearAllMocks();
  });

  // --- Test Cases ---

  test('should render all child components', () => {
    render(<Login />);

    // Check if the mocked child components are present
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
    expect(screen.getByText('LoginInput Mock')).toBeInTheDocument();
    expect(screen.getByText('Footer Mock')).toBeInTheDocument();
  });

  test('should render images with correct alt and title attributes using translations', () => {
    render(<Login />);

    const logoImageWithIncorrectSrcInComponent = screen.getByAltText('logoAlt');
    expect(logoImageWithIncorrectSrcInComponent).toBeInTheDocument();
    expect(logoImageWithIncorrectSrcInComponent).toHaveAttribute('src', 'login.svg');
    expect(logoImageWithIncorrectSrcInComponent).toHaveAttribute('title', 'logoAlt');

    const loginImage = screen.getByAltText('loginImageAlt');
    expect(loginImage).toBeInTheDocument();
    expect(loginImage).toHaveAttribute('src', 'login.svg'); // This should still be 'login.svg'
  });

  test('should display translated text content', () => {
    render(<Login />);

    expect(screen.getByText(/titleLine1/i)).toBeInTheDocument();
    expect(screen.getByText(/titleLine2/i)).toBeInTheDocument();
  });

  test('should have correct styling classes on main container', () => {
    render(<Login />);

    const { container } = render(<Login />);
    const mainContainer = container.querySelector('.min-h-screen.rounded-sm.border.border-stroke');
    
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('rounded-sm');
    expect(mainContainer).toHaveClass('border');
    expect(mainContainer).toHaveClass('border-stroke');
    expect(mainContainer).toHaveClass('pt-10');
    expect(mainContainer).toHaveClass('shadow-default');
    expect(mainContainer).toHaveClass('dark:border-strokedark');
    expect(mainContainer).toHaveClass('dark:bg-boxdark');

  });

  test('should show the LoginImg section on large screens and hide on smaller screens (based on Tailwind classes)', () => {
 
    render(<Login />);

    const loginImgSection = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'div' &&
             element.classList.contains('hidden') &&
             element.classList.contains('xl:block') &&
             element.classList.contains('xl:w-1/2');
    });

    expect(loginImgSection).toBeInTheDocument();
    // You could also specifically check for the img inside this section:
    expect(loginImgSection).toContainElement(screen.getByAltText('loginImageAlt'));
  });

});
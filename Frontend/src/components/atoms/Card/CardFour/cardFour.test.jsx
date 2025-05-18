import React from 'react';
import { render, screen } from '@testing-library/react';
import CardFour from './index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getDataKehadiran } from '../../../../config/redux/action';
import { useTranslation } from 'react-i18next';

// Mocks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../../config/redux/action', () => ({
  getDataKehadiran: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // simple mock that returns the key itself
  }),
}));

describe('CardFour Component', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        dataKehadiran: {
          dataKehadiran: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and displays attendance count', () => {
    render(<CardFour />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('cards.attendance')).toBeInTheDocument();
  });

  it('dispatches getDataKehadiran on mount', () => {
    render(<CardFour />);
    expect(dispatchMock).toHaveBeenCalledWith(getDataKehadiran());
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });
});
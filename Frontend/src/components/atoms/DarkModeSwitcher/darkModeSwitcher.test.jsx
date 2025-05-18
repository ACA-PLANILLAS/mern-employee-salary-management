import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import DarkModeSwitcher from './index.jsx'

// Mock del hook
jest.mock('../../../hooks/useColorMode', () => {
  return jest.fn()
})

import useColorMode from '../../../hooks/useColorMode'

describe('DarkModeSwitcher', () => {
  it('muestra modo claro por defecto y cambia a oscuro al hacer clic', () => {
    const setColorMode = jest.fn()
    useColorMode.mockReturnValue(['light', setColorMode])

    const { getByRole } = render(<DarkModeSwitcher />)

    const input = getByRole('checkbox')
    expect(input).toBeInTheDocument()

    fireEvent.click(input)
    expect(setColorMode).toHaveBeenCalledWith('dark')
  })

  it('muestra modo oscuro y cambia a claro al hacer clic', () => {
    const setColorMode = jest.fn()
    useColorMode.mockReturnValue(['dark', setColorMode])

    const { getByRole } = render(<DarkModeSwitcher />)

    const input = getByRole('checkbox')
    expect(input).toBeInTheDocument()

    fireEvent.click(input)
    expect(setColorMode).toHaveBeenCalledWith('light')
  })
})
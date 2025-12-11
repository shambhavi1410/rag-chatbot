import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import './ThemeToggle.css'

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
      {theme === 'light' ? <FaMoon /> : <FaSun />}
      <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle


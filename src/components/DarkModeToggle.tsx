import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { toggleDarkMode } from '../features/darkModeSlice';

const DarkModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;

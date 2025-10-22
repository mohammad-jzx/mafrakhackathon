import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AgricultureSearch } from './components/AgricultureSearch';

function App() {
  return (
    <ThemeProvider>
      <AgricultureSearch />
    </ThemeProvider>
  );
}

export default App;
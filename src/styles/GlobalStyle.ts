import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'JetBrains Mono', monospace;
    background: #0d0e14;
    color: #c0caf5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  ::selection {
    background: rgba(122, 162, 247, 0.3);
    color: #c0caf5;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(86, 95, 137, 0.3);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(86, 95, 137, 0.5);
  }

  input, textarea {
    font-family: 'JetBrains Mono', monospace;
  }

  button {
    font-family: 'JetBrains Mono', monospace;
  }
`;

export default GlobalStyle;

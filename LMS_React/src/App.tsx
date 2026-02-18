import { RouterProvider } from "react-router-dom";
import { router } from "./components/router.tsx";
import { Provider } from "react-redux";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#212529",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

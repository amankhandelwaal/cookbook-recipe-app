import React, { useEffect } from "react";
import API from "./api";

function App() {
  useEffect(() => {
    API.get("/")
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  }, []);

  return <div>Hello MERN App!</div>;
}

export default App;

import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState<string | null>(null);

  return (
    <>
      {user ? (
        <Chat username={user} />
      ) : (
        <Login onLogin={(username) => setUser(username)} />
      )}
    </>
  );
}

export default App;

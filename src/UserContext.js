import { createContext } from "react";

const UserContext = createContext({
  user: "",
  setUser: () => {},
  userid: "",
  setUserid: () => {},
  isAdmin: false,
  setIsAdmin: () => {}
});

export default UserContext;

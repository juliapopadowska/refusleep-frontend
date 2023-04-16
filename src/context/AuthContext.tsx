// import { createContext, useEffect, useReducer } from "react";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

// type UserContextState = {
//   user: string | null;
//   loading: boolean;
//   error: string | null;
//   dispatch?: React.Dispatch<any>;
// };

// export const AuthContext = createContext({
//   user: null,
//   loading: false,
//   error: null,
// });

// const AuthReducer = (state: UserContextState, action: any) => {
//   switch (action.type) {
//     case "LOGIN_START":
//       return {
//         user: null,
//         loading: true,
//         error: null,
//       };
//     case "LOGIN_SUCCESS":
//       return {
//         user: action.payload,
//         loading: false,
//         error: null,
//       };
//     case "LOGIN_FAILURE":
//       return {
//         user: null,
//         loading: false,
//         error: action.payload,
//       };
//     case "LOGOUT":
//       return {
//         user: null,
//         loading: false,
//         error: null,
//       };
//     default:
//       return state;
//   }
// };

// export const AuthContextProvider = ({ children }: any) => {
//   const [state, dispatch] = useReducer(AuthReducer, {
//     user: null,
//     loading: false,
//     error: null,
//   });

//   useEffect(() => {
//     localStorage.setItem("user", JSON.stringify(state.user));
//   }, [state.user]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user: state.user,
//         loading: state.loading,
//         error: state.error,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

export type User = {
  name: string;
  email: string;
};

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<UserContextInterface>({
  user: {
    name: "",
    email: "",
  },
  setUser: (user: User) => {},
} as UserContextInterface);

type UserProvideProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: UserProvideProps) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

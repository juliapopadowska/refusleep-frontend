import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type User = {
  name: string;
  email: string;
};

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const userInitial = {
  name: "",
  email: "",
};

export const UserContext = createContext<UserContextInterface>({
  user: userInitial,
  setUser: (user: User) => {},
} as UserContextInterface);

type UserProvideProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: UserProvideProps) {
  const [user, setUser] = useState<User>(
    localStorage.getItem("user") === null
      ? userInitial
      : JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      localStorage.setItem("user", JSON.stringify(userInitial));
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

/* eslint-disable linebreak-style */
import { createContext, useReducer, ReactNode } from "react";

// Interface representing a User
export interface User {
  _id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  role: string;
  children?: User[],
  dateRegistered: Date;
  parents?: User[],
  wakeTime?: Date,
  breakfastTime?: Date,
  lunchTime?: Date,
  dinnerTime?: Date,
  sleepTime?: Date
}

// Interface representing a User Action
interface UserAction {
  type: string;
  payload: User | null;
}

// Initial state for the UserContext
const initialState: {
  currentUser: User | null;
  users: User[];
} = {
  currentUser: null,
  users: []
};

// Reducer function for UserContext
function userReducer(
  state: typeof initialState,
  action: UserAction
): typeof initialState {
  switch (action.type) {
  case "ADD_USER":
    return {
      ...state,
      users: action.payload ? [...state.users, action.payload] : state.users
    };
  case "DELETE_USER":
    return {
      ...state,
      users: state.users.filter(user => user._id !== action.payload?._id),
    };
  case "SET_CURRENT_USER":
    return {
      ...state,
      currentUser: action.payload
    };
  case "EDIT_USER_INFO":
    return {
      ...state,
      currentUser: action.payload
    };
  default:
    return state;
  }
}

// Create UserContext
export const UserContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

interface UserContextProviderProps {
  children: ReactNode;
}

// UserContextProvider component
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
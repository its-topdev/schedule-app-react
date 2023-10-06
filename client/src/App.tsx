/* eslint-disable linebreak-style */
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./context/userContext";
import { useContext } from "react";
import CurrentTask from "./components/CurrentTask";
import ListTasks from "./components/ListTasks";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import ChildRegistrationModals from "./components/ChildRegistrationModals";

function App() {
  const { state } = useContext(UserContext);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={state.currentUser ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {state.currentUser ? (
          <>
            <Route path="/tasks" element={<ListTasks />} />
            <Route path="/current-task" element={<CurrentTask />} />
            <Route path="/register-child" element={<ChildRegistrationModals />} />
          </>
        ) : (
          <>
            <Route path="/tasks" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
            <Route path="/current-task" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
            <Route path="/register-child" element={
              <>
                <p className="text-danger">You must be logged in to see this page!</p>
              </>
            } />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;

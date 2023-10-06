import { UserContext } from "src/context/userContext";
import { useContext, useEffect, useState } from "react";
import CurrentTask from "./CurrentTask";
import { Link } from "react-router-dom";
import ChildRegistrationModals from "./ChildRegistrationModals";
import ChildSchedule from "./ChildSchedule";
import { Modal, Button } from "react-bootstrap";

const Home = (): JSX.Element => {
  const { state, dispatch } = useContext(UserContext);
  const [showModal, setShowModal] = useState(true);

  const handleModalToggle = () => setShowModal(!showModal);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const detailsResponse = await fetch(
          "https://dragonosman-task-scheduler.onrender.com/api/users/user-details", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            mode: "cors"
          });

        if (detailsResponse.ok) {
          const data = await detailsResponse.json();
          console.log("in Home, data.user is:");
          for (const [key, value] of Object.entries(data.user)) {
            console.log(`${key}: ${value}`);
          }
          dispatch({
            type: "SET_CURRENT_USER",
            payload: data.user
          });
        } else {
          console.error(`${detailsResponse.status}: ${detailsResponse.statusText}`);
        }
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  let data;
  if (state.currentUser) {
    console.log(state.currentUser.role);

    if (state.currentUser.role === "parent" &&
    state.currentUser.dateRegistered === new Date()) {
      let firstChild;
      let children;
      if (state.currentUser.children) {
        if (state.currentUser.children.length === 1) {
          firstChild = state.currentUser.children[0];
        } else if (state.currentUser.children.length > 1) {
          children = state.currentUser.children;
        }
      }
      data = (
        Array.isArray(children) ? (
          <>
            <ChildRegistrationModals />
            <Modal closeButton={handleModalToggle} show={showModal}>
              <Modal.Header>
                <Modal.Title>Add Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add tasks for your children now or later?</p>
                <Button className="btn btn-primary">
                  Add Tasks
                </Button>
                <Button className="btn btn-secondary">
                  Later
                </Button>
              </Modal.Body>
            </Modal>
          </>
        ) : (firstChild && (
          <>
            <ChildRegistrationModals />
            <Modal closeButton={handleModalToggle} show={showModal}>
              <Modal.Header>
                <Modal.Title>Add {firstChild.firstName}&apos;s Tasks Now?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to add {firstChild.firstName}&apos;s tasks now or later?</p>
                <Link to="/add-task">
                  <Button>Add Task</Button>
                </Link>
                <Button onClick={handleModalToggle}>
                  Later
                </Button>
              </Modal.Body>
            </Modal>
          </>
        )));
    }
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-auto">
          {state.currentUser && state.currentUser.role === "child" ? (
            <CurrentTask />
          ) : state.currentUser && state.currentUser.role === "parent" ? (
            <>
              {data && data}
              {state.currentUser.children && (
                state.currentUser.children.length === 1 ? (
                  <ChildSchedule child={state.currentUser.children[0]} />
                ) : (
                  <ul className="schedules">
                    {state.currentUser.children && state.currentUser.children.map(child => (
                      <li className="link" key={child._id}>
                        {state.currentUser && state.currentUser.children && (
                          <ChildSchedule child={child} />
                        )}
                      </li>
                    ))}
                  </ul>
                )
              )}
              <Link to="/tasks">Tasks Page</Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
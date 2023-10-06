import { useContext, useState, useEffect, useRef } from "react";
import { UserContext, User } from "src/context/userContext";
import { useTaskContext } from "../context/taskContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "react-bootstrap";
import { useFormik, FormikValues } from "formik";
import * as Yup from "yup";

const ChildRegistrationModals = () => {
  const { state, dispatch } = useContext(UserContext);
  const { addTask } = useTaskContext();
  const [showModal, setShowModal] = useState(true);
  const [modalIndex, setModalIndex] = useState(0);

  const handleModalToggle = () => setShowModal(!showModal);

  const firstNameRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const initialValues: User = {
    firstName: "",
    lastName: state.currentUser ? state.currentUser.lastName : undefined,
    username: "",
    password: "",
    confirmPassword: "",
    parents: state.currentUser ? [state.currentUser] : undefined,
    dateRegistered: new Date(),
    wakeTime: new Date(),
    breakfastTime: new Date(),
    lunchTime: new Date(),
    dinnerTime: new Date(),
    sleepTime: new Date(),
    role: "child"
  };

  const handleSubmit = async (values: FormikValues) => {
    const child: User = {
      firstName: values.firstName,
      lastName: state.currentUser ? state.currentUser.lastName : values.lastName,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
      parents: state.currentUser ? [state.currentUser] : values.parents,
      dateRegistered: values.dateRegistered,
      wakeTime: values.wakeTime,
      breakfastTime: values.wakeTime,
      lunchTime: values.lunchTime,
      dinnerTime: values.dinnerTime,
      sleepTime: values.sleepTime,
      role: "child",
    };

    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(child)
        });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "ADD_USER",
          payload: data.user
        });
        if (state.currentUser && state.currentUser.children) {
          state.currentUser.children.push(data.user);
        }
        navigate("/");
      } else {
        console.error(`${response.status}:${response.statusText}`);
      }
    } catch (err) {
      console.error(`Couldn't register your child: ${err}`);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      username: Yup.string()
        .matches(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a requried field"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("This is a required field")
    })
  });

  useEffect(() => {
    const addToTasksArray = async () => {
      if (state.currentUser && state.currentUser.children) {
        for (const child of state.currentUser.children) {
          for (const [key, value] of Object.entries(child)) {
            if (key === "wakeTime" || key === "breakfastTime"
            || key === "lunchTime" || key === "dinnerTime"
            || key === "sleepTime") {
              const startDate = new Date();
              const [hourStr, minuteStr] = value.split(":");
              startDate.setHours(parseInt(hourStr));
              startDate.setMinutes(parseInt(minuteStr));

              let endDate;
              if (key === "wakeTime") {
                endDate = new Date();
                endDate.setHours(startDate.getHours());
                endDate.setMinutes(startDate.getMinutes() + 10);
              } else if (key === "lunchTime" || key === "dinnerTime") {
                endDate = new Date();
                endDate.setHours(startDate.getHours() + 1);
                endDate.setMinutes(0);
              }

              if (key === "breakfastTime") {
                endDate = undefined;
              }

              try {
                const response = await fetch(
                  "https://dragonosman-task-scheduler.onrender.com/api/tasks/add-task", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      title: key.substring(0, key.indexOf("T"))
                        .charAt(0)
                        .toUpperCase() + key
                        .substring(0, key.indexOf("T"))
                        .slice(1)
                      ,
                      startDate: new Date(value),
                      endDate: new Date(value),
                      text: key.substring(0, key.indexOf("T")),
                      start: new Date(value),
                      end: new Date(value),
                      startTime: value,
                      endTime: value,
                      timer: "",
                      time: value,
                      scheduled: true,
                      flexible: false,
                      isCompleted: false,
                      isRecurring: true,
                      daysRecurring: ["Sunday", "Monday", "Tuesday", "Wednesday",
                        "Thursday", "Friday", "Saturday"],
                      rRule: "RRULE:FREQ=DAILY,INTERVAL=1,BYDAY=SU,MO,TU,WE,TU,FR,SA"
                    })
                  });

                if (response.ok) {
                  const data = await response.json();
                  addTask(data.task);
                } else {
                  console.error(`${response.status}: ${response.statusText}`);
                }
              } catch (err) {
                console.error(`Something went wrong: ${err}`);
              }
            }
          }
        }
      }
    };
    addToTasksArray();
  }, [state.currentUser, addTask]);

  const childName = firstNameRef && firstNameRef.current ? firstNameRef.current.value : undefined;
  const modalTitles = [
    "Setup your child's profile",
    `Enter ${childName && childName}'s username and password`,
    `Enter ${childName && childName}'s wake and sleep times`,
    `Enter ${childName && childName}'s meal times`,
  ];

  const modalContents = [
    <fieldset className="mb-3" key="firstName">
      <legend>Enter your child&apos;s information</legend>
      <label htmlFor="firstName" className="form-label">
        Enter your child&apos;s name:
      </label>
      <input
        type="text"
        placeholder="Enter child's name"
        required
        className="form-control"
        ref={firstNameRef}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <small className="text-danger">{formik.errors.firstName}</small>
      ) : null}
    </fieldset>,
    <fieldset className="mb-3" key="username-password">
      <legend>{modalTitles[1]}</legend>
      <label htmlFor="username" className="form-label">
        Username:
      </label>
      <input
        type="text"
        placeholder="Enter child's username"
        required
        className="form-control"
      />
      {formik.touched.username && formik.errors.username ? (
        <small className="text-danger">{formik.errors.username}</small>
      ) : null}
      <label htmlFor="password" className="form-label">
        Password:
      </label>
      <input
        type="password"
        placeholder="Enter child's password"
        required
        className="form-control"
      />
      {formik.touched.password && formik.errors.password ? (
        <small className="text-danger">{formik.errors.password}</small>
      ) : null}
      <label htmlFor="confimPassword" className="form-label">
        Confirm Password:
      </label>
      <input
        type="password"
        placeholder="Re-type the password"
        required
        className="form-control"
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <small className="text-danger">{formik.errors.confirmPassword}</small>
      ) : null}
    </fieldset>,
    <fieldset className="mb-3" key="wake-sleep-times">
      <legend>{modalTitles[2]}</legend>
      <label htmlFor="wakeTime" className="form-label">
        Wake Time:
      </label>
      <input
        type="text"
        placeholder="Enter your child's wake time"
        required
        className="form-control"
      />
      {formik.touched.wakeTime && formik.errors.wakeTime ? (
        <small className="text-danger">{formik.errors.wakeTime}</small>
      ) : null}
      <label htmlFor="sleepTime" className="form-label">
        Sleep Time:
      </label>
      <input
        type="text"
        placeholder="Enter your child's sleep time"
        required
        className="form-control"
      />
      {formik.touched.sleepTime && formik.errors.sleepTime ? (
        <small className="text-danger">{formik.errors.sleepTime}</small>
      ) : null}
    </fieldset>,
    <fieldset className="mb-3" key="meal-times">
      <label htmlFor="lunchTime" className="form-label">
        Lunch Time:
      </label>
      <input
        type="text"
        placeholder="Enter your child's lunch time"
        required
        className="form-control"
      />
      {formik.touched.lunchTime && formik.errors.lunchTime ? (
        <small className="text-danger">{formik.errors.lunchTime}</small>
      ) : null}
      <label htmlFor="dinnerTime" className="form-label">
         Dinner Time:
      </label>
      <input
        type="text"
        placeholder="Enter your child&apos;s dinner time"
        required
        className='form-control'
      />
      {formik.touched.dinnerTime && formik.errors.dinnerTime ? (
        <small className="text-danger">{formik.errors.dinnerTime}</small>
      ) : null}
    </fieldset>
  ];

  return (
    <div className="container-fluid child-registration-form-container">
      <h2>Child Registration</h2>
      <form
        method="post"
        className="container-fluid child-registration-form"
        onSubmit={event => {
          event.preventDefault();
          formik.handleSubmit();
        }}
      >
        {modalTitles.map((title, index) => (
          <>
            {index === modalIndex && (
              <>
                <Modal show={showModal} onHide={handleModalToggle}>
                  <ModalHeader closeButton>
                    <i
                      className="fa-solid fa-angle-left"
                      onClick={() => {
                        if (index > 0) {
                          setModalIndex(index - 1);
                        } else if (index === 0) {
                          const answer = confirm(
                            "Are you sure you want to cancel and return to home screen?"
                          );
                          if (answer) {
                            navigate("/");
                          }
                        }
                      }}
                    ></i>
                    <ModalTitle>{title}</ModalTitle>
                  </ModalHeader>
                  <ModalBody>{modalContents[index]}</ModalBody>
                  <ModalFooter>
                    {index < modalTitles.length - 1 ? (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setModalIndex(index + 1);
                        }}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="secondary"
                      >
                        Register Child
                      </Button>
                    )}
                  </ModalFooter>
                </Modal>
              </>
            )}
          </>
        ))}
      </form>
    </div>
  );
};

export default ChildRegistrationModals;
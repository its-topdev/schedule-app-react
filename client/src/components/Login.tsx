import { useFormik, FormikValues } from "formik";
import { UserContext } from "src/context/userContext";
import { useContext } from "react";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const initialValues: FormikValues = {
    username: "",
    password: ""
  };

  const handleSubmit = async (values: FormikValues) => {
    const user = {
      username: values.username,
      password: values.password
    };

    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_CURRENT_USER", payload: data.user });
        navigate("/");
        if (formik.isSubmitting) {
          console.log(`when submitting, username is: ${user.username}`);
        }
      } else {
        console.error(`Something went wrong. ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error in login request catch block: ${error}`);
    }
  };

  const formik = useFormik({
    onSubmit: handleSubmit,
    initialValues,
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
        .required("This is a required field"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("This is a required field")
    })
  });

  return (
    <div className="container-fluid login-form-container">
      <form
        method="post"
        className="login-form container-fluid"
        onSubmit={(event) => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
      >
        <fieldset className="mb-3">
          <legend>User login form</legend>
          <label htmlFor="username" className="form-label">Email or Username:</label>
          <input
            type="text"
            className="form-control"
            required
            {...formik.getFieldProps("username")}
          />
          {formik.touched.email && formik.errors.email ? (
            <small className="text-danger">{formik.errors.email as string}</small>
          ) : null}
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            required
            {...formik.getFieldProps("password")}
          />
        </fieldset>
        <input type="submit" value="Login" className="btn btn-secondary btn-lg" />
        <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
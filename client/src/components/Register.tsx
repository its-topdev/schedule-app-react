import { useFormik, FormikValues, FormikHelpers } from "formik";
import { UserContext, User } from "src/context/userContext";
import { useContext } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const initialValues: FormikValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "parent",
    dateRegisered: new Date()
  };

  const handleSubmit = async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
    setSubmitting(true);

    const user: User = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: values.role,
      dateRegistered: values.dateRegistered
    };

    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        });

      setSubmitting(false);
      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "ADD_USER",
          payload: data.user
        });
        navigate("/login");
      } else {
        console.error(`Couldn't register you: ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Something went wrong when trying to register: ${err}`);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, "Must be at most 20 characters")
        .required("This is a required field"),
      lastName: Yup.string()
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

  return (
    <div className="register-form-container container-fluid">
      <form
        className="parent-registration-form container-fluid"
        onSubmit={event => {
          event.preventDefault();
          formik.handleSubmit(event);
        }}
        method="post"
      >
        <fieldset className="mb-3">
          <legend>Parent registration form</legend>
          <label htmlFor="firstName" className="form-label">First name:</label>
          <input
            type="text"
            className="form-control"
            required
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <small className="text-danger">{formik.errors.firstName as string}</small>
          ) : null}
          <label htmlFor="lastName" className="form-label">Last name:</label>
          <input
            type="text"
            className="form-control"
            required
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <small className="text-danger">{formik.errors.lastName as string}</small>
          ) : null}
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
          {formik.touched.password && formik.errors.password ? (
            <small className="text-danger">{formik.errors.password as string}</small>
          ) : null}
          <label htmlFor="confirmPassword" className="form-label">Confirm password:</label>
          <input
            type="password"
            className="form-control"
            required
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <small className="text-danger">{formik.errors.confirmPassword as string}</small>
          ) : null}
        </fieldset>
        <input type="submit" className="btn btn-submit btn-secondary btn-lg" value="Register" />
      </form>
    </div>
  );
};

export default Register;
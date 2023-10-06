import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "src/context/userContext";
import { Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

const Header = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://dragonosman-task-scheduler.onrender.com/api/users/logout", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

      if (response.ok) {
        dispatch({ type: "SET_CURRENT_USER", payload: null });
        navigate("/login");
      } else {
        console.error(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Error logging you out: ${err}`);
    }
  };

  return (
    <header className="container-fluid">
      <Navbar className="bg-body-tertiary" expand="lg" fixed="top">
        <Container className="container-fluid row">
          <NavbarBrand className="col-auto">
            {state.currentUser ? (
              <Link to="/">
                <img src={logo} alt="dragon-logo" className="dragon-logo" />
              </Link>
            ) : (
              <img src={logo} alt="dragon-logo" className="dragon-logo" />
            )}
          </NavbarBrand>
          <Navbar.Toggle aria-controls="navbar-content" className="col-auto navbar-toggle" />
          <NavbarCollapse id="navbar-content">
            <Nav className="me-auto mb-2 navbar-lg-0">
              {state.currentUser ? (
                <ul className="navbar-nav col">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  {state.currentUser && state.currentUser.role === "parent" ? (
                    <li className="nav-item">
                      <Link to="/register-child" className="nav-link">Register a Child</Link>
                    </li>
                  ) : null}
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-danger"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </ul>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
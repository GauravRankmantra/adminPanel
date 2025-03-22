import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "@/assets/scss/Authentication.module.scss";
import logo from "@/assets/image/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.success) {
        // Redirect to dashboard on successful login
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.auth_wrapper}>
      <div
        className={`${styles.from_container} d-flex justify-content-center align-items-center h-100`}
      >
        <div className="col-md-10 col-lg-8 col-xl-5">
          <div className={`${styles.card} card rounded-0`}>
            <div className={`${styles.card_header} card-header`}>
              <strong> Welcome !</strong>
            </div>
            <div className={`${styles.card_body} card-body`}>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className={`${styles.input_group} input-group mb-3`}>
                  <span
                    className={`${styles.input_group_icon} input-group-text`}
                  >
                    <i className="fa fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={`${styles.input_group} input-group mb-3`}>
                  <span
                    className={`${styles.input_group_icon} input-group-text`}
                  >
                    <i className="fa fa-asterisk"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button type="submit" className="btn btn-primary">
                    Log In
                  </button>
                  <Link
                    to="/register"
                    className="text-white text-decoration-none"
                  >
                    Create Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.logo_container} h-100`}>
        <div className={styles.oblique}></div>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

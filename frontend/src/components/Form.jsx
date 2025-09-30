import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "../components/LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handlesubmit = async (e) => {
    setloading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        // if we logged in we get access and refresh token from backend
        localStorage.setItem(ACCESS_TOKEN, res.data.access); // set token as key value pair in application
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error); // show if the user not reegister in database;
    } finally {
      setloading(false);
    }
  };
  return (
    <form onSubmit={handlesubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>

    </form>
  );
}
export default Form;

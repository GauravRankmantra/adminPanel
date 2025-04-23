import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import 'react-quill/dist/quill.snow.css';
import "./index.scss";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BrowserRouter basename="/admin">

        <App />
    </BrowserRouter>
);


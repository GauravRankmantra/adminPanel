import { Fragment, useEffect } from "react";
import { EntypoSprite } from "@entypo-icons/react";
import { Routes, Route } from "react-router-dom";
import routes from "@/routes.jsx";
import Layouts from "@/layouts/Layouts.jsx";
import { DashboardDataProvider } from "@/context/dashboardDataContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute
import axios from "axios";

function App() {
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const res = await axios.get(
  //       "https://backend-music-xg6e.onrender.com/api/v1/auth/checkAdminToken",
  //       { withCredentials: true }
  //     );
  //     if (!res) localStorage.removeItem("user");
  //   };
  //   checkAuth();
  // }, []);

  return (
    <div className="admin-container position-relative overflow-hidden">
      <DashboardDataProvider>
        <EntypoSprite />
        <Routes>
          {routes?.map((item, index) => {
            return (
              <Fragment key={index}>
                {(item?.path && (
                  <Route path="/" element={<Layouts />}>
                    <Route
                      path={item?.path}
                      element={
                        <ProtectedRoute>
                          <item.component />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                )) ||
                  (item?.route && (
                    <Route path={item?.route} element={<item.component />} />
                  ))}
              </Fragment>
            );
          })}
        </Routes>
      </DashboardDataProvider>
    </div>
  );
}

export default App;

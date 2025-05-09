import React from "react";
import Header from "./Header";
import { Link,useLocation } from "react-router-dom";

const FrageErfolgreich = () => {
  const location = useLocation();
  const data = location.state || {};
  const message = data.msg || "No message available.";
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl w-1/2 text-center">
          <br />
          <br />
          <br />
          <h2 className="text-2xl font-bold">Frage erfolgreich gespeichert!</h2>

          <p className="mt-4">{message}</p>

          {/* Button für neue Frage */}
          <div className="mt-6 flex justify-center space-x-4" style={{ marginTop: "250px" }}>
            <Link to="/questions" className="btn btn-primary me-3">Neue Frage hinzufügen</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrageErfolgreich;

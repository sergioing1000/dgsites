import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const MySpinnerComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <ClipLoader
          color={"#123abc"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <h2>Data Loaded!</h2>
      )}
    </div>
  );
};

export default MySpinnerComponent;
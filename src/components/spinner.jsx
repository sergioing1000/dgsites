import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { Bars } from "react-loader-spinner";
import { Oval } from "react-loader-spinner";

import { TailSpin } from "react-loader-spinner";
import { CirclesWithBar } from "react-loader-spinner";
import { ThreeDots } from "react-loader-spinner";
import { Rings } from "react-loader-spinner";


const SpinnerComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <Bars
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <Oval
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <Rings
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <ThreeDots
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <CirclesWithBar
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
      <span style={{ textAlign: "center", marginTop: "50px" }}>
        {loading ? (
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <h2>Data Loaded!</h2>
        )}
      </span>
    </>
  );
};

export default SpinnerComponent;
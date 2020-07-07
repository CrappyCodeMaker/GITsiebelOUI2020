import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-div">
      <div className="loading-spinner-pulse">
        <div className="loading-blocks">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Loader;

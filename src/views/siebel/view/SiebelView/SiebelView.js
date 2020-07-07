import React from "react";
import { CCard, CCardBody, CCardHeader } from "@coreui/react";

import "./SiebelView.css";

const SiebelView = () => {
  return (
    <CCard>
      <CCardHeader className="header-first-lvl">
        SIEBEL
        <small className="small-text-muted"> view</small>
      </CCardHeader>

      <CCardBody className="body-first-lvl">
        <h1>TEXT TEXT TEXT</h1>
      </CCardBody>
    </CCard>
  );
};

export default SiebelView;

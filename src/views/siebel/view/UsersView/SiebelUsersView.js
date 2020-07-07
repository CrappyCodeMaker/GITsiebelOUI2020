import React, { Component } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CCollapse,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { UsersList, UserDetails, PostsList, ErrorMessage } from "./Components";

import "./SiebelUsersView.css";

export default class SiebelUsersView extends Component {
  state = {
    selectedUser: null,
    hasError: false,
    collapse: 1,
  };

  componentDidCatch(error, info) {
    alert(`
		info: ${info}
		error: ${error}
		`);
    this.setState({ hasError: true });
  }

  onUserSelected = ({ id }) => {
    this.setState({
      selectedUser: id,
    });
  };

  render() {
    const { collapse, selectedUser, hasError } = this.state;
    let selectedId;

    selectedUser ? (selectedId = `#${selectedUser}`) : (selectedId = "");

    if (hasError) return <ErrorMessage />;

    return (
      <CCard>
        <CCardHeader className="header-first-lvl">
          USERS
          <small className="small-text-muted"> view </small>
          <div className="card-header-actions">
            <small className="small-text-muted">{" | "}</small>
            <CTooltip content={`CrappyCodeMaker`} placement="top">
              <CLink
                key="github"
                href="https://github.com/CrappyCodeMaker"
                rel="noreferrer noopener"
                target="_blank"
                className="card-header-action"
              >
                <small className="small-text-muted-link">Github</small>
              </CLink>
            </CTooltip>
            <small className="small-text-muted"> {" | "}</small>
            <CTooltip content={`JSONplaceholder official page`} placement="top">
              <CLink
                key="APIlink"
                href="https://jsonplaceholder.typicode.com/guide.html"
                rel="noreferrer noopener"
                target="_blank"
                className="card-header-action"
              >
                <small className="small-text-muted-link">JSONPlaceholder</small>
              </CLink>
            </CTooltip>
            <small className="small-text-muted">{" | "}</small>
          </div>
        </CCardHeader>

        <CCardBody className="body-first-lvl">
          <div id="collapse">
            <UsersList onUserSelected={this.onUserSelected} />
            <CCard>
              <CLink
                key="UserDetails"
                className="small-text-muted-link"
                onClick={() =>
                  collapse === 0
                    ? this.setState({ collapse: null })
                    : this.setState({ collapse: 0 })
                }
              >
                <CTooltip
                  content={`More info about user ${selectedId}`}
                  placement="top-start"
                >
                  <CCardHeader className="header-second-lvl">
                    <small className="text-muted">
                      <b>User Details</b>
                    </small>
                    <div className="card-header-actions left">
                      <CIcon name="cil-user" className="icon-header" />
                    </div>
                  </CCardHeader>
                </CTooltip>
              </CLink>
              <CCollapse show={collapse === 0}>
                <UserDetails idUser={this.state.selectedUser} />
              </CCollapse>
            </CCard>

            <CCard>
              <CLink
                key="PostsList"
                className="small-text-muted-link"
                onClick={() =>
                  collapse === 1
                    ? this.setState({ collapse: null })
                    : this.setState({ collapse: 1 })
                }
              >
                <CTooltip
                  content={`Posts that wrote user ${selectedId}`}
                  placement="top-start"
                >
                  <CCardHeader className="header-second-lvl">
                    <small className="text-muted">
                      <b>Posts</b>
                    </small>
                    <div className="card-header-actions left">
                      <CIcon name="cil-speech" className="icon-header" />
                    </div>
                  </CCardHeader>
                </CTooltip>
              </CLink>
              <CCollapse show={collapse === 1}>
                <PostsList idUser={this.state.selectedUser} />
              </CCollapse>
            </CCard>
          </div>
        </CCardBody>
      </CCard>
    );
  }
}

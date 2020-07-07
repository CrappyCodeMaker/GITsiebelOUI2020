import React, { Component } from "react";
import { CCardHeader, CCard, CCardBody, CDataTable } from "@coreui/react";
import CIcon from "@coreui/icons-react";

import UsersApiService from "../../ApiService/UsersApiService";
import { Loader, ErrorMessage } from "../../Components";

import "./UsersList.css";

export default class UsersList extends Component {
  usersApiService = new UsersApiService();

  state = {
    usersList: null,
    hasError: false,
  };

  componentDidCatch(error, info) {
    alert(`
		info: ${info}
		error: ${error}
		`);
    this.setState({ hasError: true });
  }

  onError = (error) => {
    this.setState({ hasError: true });
  };

  componentDidMount() {
    this.usersApiService
      .getAllUsers()
      .then((usersList) => {
        this.setState({
          usersList,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { usersList, hasError } = this.state;

    if (hasError) return <ErrorMessage />;

    const fields = [
      {
        key: "id",
        _style: { width: "5%", background: "#ebedef" },
      },
      { key: "name", _style: { width: "30%", background: "#ebedef" } },
      { key: "username", _style: { width: "15%", background: "#ebedef" } },
      { key: "phone", _style: { width: "15%", background: "#ebedef" } },
      { key: "website", _style: { width: "15%", background: "#ebedef" } },
    ];

    const paginationSettings = {
      className: "users-list-paginations",
      size: "sm",
      align: "center",
      dots: true,
      limit: 3,
    };

    if (!usersList) {
      return (
        <CCard>
          <CCardHeader className="header-second-lvl">
            <small className="text-muted">
              <b>Users</b>
            </small>
            <div className="card-header-actions left">
              <CIcon name="cil-people" className="icon-header" />
            </div>
          </CCardHeader>

          <CCardBody className="body-second-lvl">
            <div className="text-div">
              PROCESSING...
              <Loader />
            </div>
          </CCardBody>
        </CCard>
      );
    }

    return (
      <CCard>
        <CCardHeader className="header-second-lvl">
          <small className="text-muted">
            <b>Users</b>
          </small>
          <div className="card-header-actions left">
            <CIcon name="cil-people" className="icon-header" />
          </div>
        </CCardHeader>

        <CCardBody className="body-second-lvl">
          <CDataTable
            items={usersList}
            fields={fields}
            size="sm"
            responsive
            tableFilter
            itemsPerPageSelect
            itemsPerPage={3}
            sorter
            pagination={paginationSettings}
            clickableRows
            onRowClick={(id) => this.props.onUserSelected(id)}
          />
        </CCardBody>
      </CCard>
    );
  }
}

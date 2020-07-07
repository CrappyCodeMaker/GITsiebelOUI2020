import React, { Component } from "react";
import {
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormGroup,
  CLabel,
  CInput,
  CCard,
} from "@coreui/react";

import UsersApiService from "../../ApiService/UsersApiService";
import { Loader, ErrorMessage } from "../../Components";

import "./UserDetail.css";

export default class UserDetails extends Component {
  usersApiService = new UsersApiService();

  state = {
    userDetails: null,
    hasError: false,
  };

  componentDidMount() {
    this.updateUserPosts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.idUser !== prevProps.idUser) this.updateUserPosts();
  }

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

  updateUserPosts() {
    const { idUser } = this.props;
    if (!idUser) return;

    this.usersApiService
      .getUserDetails(idUser)
      .then((userDetails) => {
        this.setState({ userDetails });
      })
      .catch(this.onError);
  }

  render() {
    const { userDetails, hasError } = this.state;

    if (hasError) return <ErrorMessage />;

    if (!userDetails) {
      return (
        <CCardBody className="body-second-lvl">
          <div className="text-div">
            Select user for more info
            <Loader />
          </div>
        </CCardBody>
      );
    }

    const { zipcode, city, street, suite } = userDetails.address;
    const { name, catchPhrase, bs } = userDetails.company;

    return (
      <CCardBody className="body-second-lvl">
        <CRow>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader className="header-second-lvl">
                <small className="text-muted">Address</small>
              </CCardHeader>
              <CCardBody className="body-third-lvl">
                <CFormGroup>
                  <CLabel htmlFor="zipcode">Zipcode</CLabel>
                  <CInput id="zipcode" placeholder={zipcode} />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="city">City</CLabel>
                  <CInput id="city" placeholder={city} />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="street">Street</CLabel>
                  <CInput id="street" placeholder={street} />
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="8" sm="4">
                    <CFormGroup>
                      <CLabel htmlFor="apartments">Apartments</CLabel>
                      <CInput id="apartments" placeholder={suite} />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader className="header-second-lvl">
                <small className="text-muted">Company</small>
              </CCardHeader>
              <CCardBody className="body-third-lvl">
                <CFormGroup>
                  <CLabel htmlFor="company-name">Company name</CLabel>
                  <CInput id="company-name" placeholder={name} />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="catchPhrase">Catchphrase</CLabel>
                  <CInput id="catchPhrase" placeholder={catchPhrase} />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="bs">Bs</CLabel>
                  <CInput id="bs" placeholder={bs} />
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    );
  }
}

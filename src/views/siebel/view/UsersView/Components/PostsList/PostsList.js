import React, { Component } from "react";
import { CCardBody, CAlert } from "@coreui/react";

import UsersApiService from "../../ApiService/UsersApiService";
import { Loader, ErrorMessage } from "../../Components";

import "./PostsList.css";

export default class PostsList extends Component {
  usersApiService = new UsersApiService();

  state = {
    post: null,
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
		Info: ${info}
		Error: ${error}
		`);
    this.setState({ hasError: true });
  }

  onError = (error) => this.setState({ hasError: true });

  updateUserPosts() {
    const { idUser } = this.props;
    if (!idUser) return;

    this.usersApiService
      .getAllUserPosts(idUser)
      .then((post) => {
        this.setState({ post });
      })
      .catch(this.onError);
  }

  renderPosts(arr) {
    return arr.map(({ postId, userId, title, body }) => {
      return (
        <CAlert
          key={postId}
          color="secondary"
          className="onMouse-post"
          closeButton
          onClick={() => console.log(`userId: ${userId}, postId: ${postId}`)}
        >
          <small className="text-muted">#{postId}</small> <br />
          <b>Title:</b> {title} <br />
          <b>Body:</b> {body}
        </CAlert>
      );
    });
  }

  render() {
    const { post, hasError } = this.state;
    if (hasError) return <ErrorMessage />;

    if (!post) {
      return (
        <CCardBody className="body-second-lvl">
          <div className="no-posts-div">
            <span className="no-posts-list">Select user to see his posts</span>
            <Loader />
          </div>
        </CCardBody>
      );
    }

    const posts = this.renderPosts(post);
    return (
      <CCardBody className="body-second-lvl">
        <div className="posts-list">{posts}</div>
      </CCardBody>
    );
  }
}

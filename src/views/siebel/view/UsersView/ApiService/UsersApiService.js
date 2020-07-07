export default class UsersApiService {
  _apiBase = "https://jsonplaceholder.typicode.com";

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  };

  getAllUsers = async () => {
    const res = await this.getResource(`/users/`);
    return res.map(this._transformUser);
  };

  getUserDetails = async (id) => {
    const user = await this.getResource(`/users/${id}/`);
    return this._transformUser(user);
  };

  getAllUserPosts = async (id) => {
    const res = await this.getResource(`/users/${id}/posts/`);
    return res.map(this._transformPost);
  };

  _transformPost = (post) => {
    return {
      postId: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
    };
  };

  _transformUser = (user) => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      website: user.website,
      address: user.address,
      company: user.company,
    };
  };
}

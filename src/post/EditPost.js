import React, { Component } from 'react';

import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import DefaultPost from '../images/mountains.jpg';
import { singlePost, update } from './apiPost';

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      title: '',
      body: '',
      error: '',
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
    
    };
  }

  init = (postId) => {
    
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          photo: data.photo,
          error: '',
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 100000) {
      this.setState({ error: 'File size should be less than 1mb', loading: false });
      return false;
    }
    if (title.length === 0) {
      this.setState({ error: 'Title is required', loading: false });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: 'Body is required', loading: false });
      return false;
    }
    
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    const fileSize = name === 'photo' ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      update(postId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
         // updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          //});
      });
    }
  };

  editForm = (title, body, error) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Post Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Title</label>
        <input
          onChange={this.handleChange('title')}
          type='text'
          className='form-control'
          value={title}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Body</label>
        <textarea
          onChange={this.handleChange('body')}
          type='text'
          className='form-control'
          value={body}
        />
      </div>
     
      {error && <div className='alert alert-danger'>{error}</div>}

      <button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>
        Update Post
      </button>
    </form>
  );

  render() {
    const {
      id,
      title,
      body,
      error,
      redirectToProfile,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/post/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/post/photo/${id}?${new Date().getTime()}`
      : DefaultPost;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Post</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading....</h2>
          </div>
        ) : (
          ''
        )}
        <img
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
          src={photoUrl}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          alt={title}
        />
        {this.editForm(title, body, error)}
      </div>
    );
  }
}

export default EditPost;

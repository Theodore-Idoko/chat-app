import React, { Component } from 'react';
import { singlePost, remove } from './apiPost';
import { Link } from 'react-router-dom';
import DefaultPost from '../images/mountains.jpg';
import { Redirect } from 'react-router';
import {isAuthenticated} from '../auth'

class SinglePost extends Component {
  state = {
    post: '',
    redirect: false,
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        
        this.setState({ post: data });
      }
    });
  };

  deletePost = () => {
    const token = isAuthenticated().token;
    const postId = this.props.match.params.postId;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        
        this.setState({ redirect: true });
      }
    });
  };
  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete your post');
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    if(this.state.redirect){
      return <Redirect to='/' />
    }
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
    const posterName = post.postedBy ? post.postedBy.name : 'unknown';

    return (
      <div className='card-body'>
        <img
          style={{ height: '400px', width: 'auto' }}
          className='img-thumbnail mb-3'
          src={`${process.env.REACT_APP_API_URL}/post/photo/${
            post._id
          }?${new Date().getTime()}`}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          alt={post.name}
        />

        <p className='card-text'>{post.body}</p>
        <br />
        <p className='font-italic mark'>
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className='d-inline-block'>
          <Link to={`/`} className='btn btn-raised btn-primary btn-sm mr-5'>
            Back to posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link className='btn btn-raised btn-warning mr-5' to={`/post/edit/${post._id}`}>
                  Update Post
                </Link>
                <button className='btn btn-raised btn-danger '  onClick={this.deleteConfirmed}>
                  Delete Post
                </button>{' '}
              </>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post } = this.state;
    return (
      <div className='container'>
        <h2 className='card-title display-2 mt-3 mb-2'>{post.title}</h2>
        {!post ? (
          <div className='jumbotron text-center'>
            <h2>Loading....</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    );
  }
}

export default SinglePost;

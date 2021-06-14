import React from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';
import { read } from './apiUser';
import { useState, useEffect, useCallback, } from 'react';
import { useParams } from 'react-router-dom'

const Profile = (props) => {
  const [ user, setUser ] = useState('');

  const { redirectToSignin, setredirectToSignin } = useState(false);

 const params = useParams()
 const userId = params.userId
 

  const init = useCallback((userId) => {
    
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      console.log(data)
      if (data.error) {
        setredirectToSignin(true);
      } else {
        setUser(data);
      }
    });
  },[userId]);

  useEffect(() => {
      init(userId);
      return () => clearInterval(init);
    },[init]
    
  );

  //componentDidUpdate(){
  //const userId = this.props.match.params.userId;
  //this.init(userId);
  // }

  if (redirectToSignin) return <Redirect to='/signin' />;
  const photoUrl = user._id
  ? `${
      process.env.REACT_APP_API_URL
    }/user/photo/${user._id}?${new Date().getTime()}`
  : DefaultProfile;

  return (
    <div className='container'>
      <h2 className='mt-5 mb-5'>Profile</h2>
      <div className='row'>
        <div className='col-md-6'>
        <img
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={user.name}
        />
        </div>
        <div className='col-md-6'>
          <div className='lead mt-2'>
            <p>Hello, {user.name}</p>
            <p>Email: {user.email}</p>
            <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
          </div>
          {isAuthenticated().user && isAuthenticated().user._id === user._id && (
            <div className='d-inline-block '>
              <Link
                className='btn btn-raised btn-success mr-5'
                to={`/user/edit/${user._id}`}
              >
                Edit Profile
              </Link>
              <DeleteUser userId={user._id} />
            </div>
          )}
        </div>
      </div>
      <div className='row'>
        <div className='col md-12 mt-5 mb-5'>
          <hr/>
          <p className='lead'>{user.about}</p>
          <hr/>
        </div>
      </div>
    </div>
  );
};

export default Profile;

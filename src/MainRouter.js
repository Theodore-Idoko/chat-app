import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import EditPost from './post/EditPost';
import FindPeople from './user/FindPeople';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost'
import PrivateRoute from './auth/PrivateRoute';

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route path='/' component={Home} exact></Route>
      <Route path='/post/:postId' component={SinglePost} exact></Route>
      <PrivateRoute
        exact
        path='/post/edit/:postId'
        component={EditPost}
      ></PrivateRoute>
      <Route path='/users' component={Users} exact></Route>
      <Route exact path='/signup' component={Signup}></Route>
      <Route exact path='/signin' component={Signin}></Route>
      <PrivateRoute
        exact
        path='/user/edit/:userId'
        component={EditProfile}
      ></PrivateRoute>
      
      <PrivateRoute
        exact
        path='/findpeople'
        component={FindPeople}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path='/user/:userId'
        component={Profile}
      ></PrivateRoute>
       <PrivateRoute
        exact
        path='/create/post'
        component={NewPost}
      ></PrivateRoute>
    </Switch>
  </div>
);

export default MainRouter;

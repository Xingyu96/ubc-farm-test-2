/*
**Author: Xingyu Tao
**Last Updated: 5-15-2017
**Comments: 
**	presentation wrapper for whole app
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import Auth from './modules/Auth';
import 'bulma/css/bulma.css'
import styled from 'styled-components'
import NavDrawerContainer from './navigation/NavDrawerContainer.jsx';


const Container = styled.div`
    height:100%;
`;

const Topbar = styled.div`
    a {
  !important color: white;
  text-decoration: none;
  transition: color 0.4s;
}
`;


const Base = ({ children }) => (
  <div  style={{height:'100%'}}>
    <Topbar className="top-bar has-shadow">
      <div className="top-bar-left">
	  <img id="logo" src="images/logo.png" alt="UBCFarm Logo"></img>
        <Link id="title" to="/">UBCFarm Monitor</Link>
      </div>

      {Auth.isUserAuthenticated() ? (
        <div className="top-bar-right">
		<Link to="/fields">Fields</Link>
		<Link to="/tasks">Tasks</Link>
		<Link to="/graphs">Graphs</Link>
		<Link to="/invoice">Invoice</Link>
        <Link to="/logout">Log out</Link>
        </div>
      ) : (
        <div className="top-bar-right">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      )}

    </Topbar>
      <Container className="columns is-gapless">
          {Auth.isUserAuthenticated() ? (
                  <NavDrawerContainer/>
              ) : (
                  <div></div>
              )}


            { /* child component will be rendered here */ }
            <div className="column is-10-desktop">
            {children}
            </div>

      </Container>
  </div>

);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
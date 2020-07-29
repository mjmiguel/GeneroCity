import React, { Component } from 'react';
import '../scss/app.scss';
import { Route, Switch, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

const Nav = (props) => {
  const logoBtn = (
    <NavLink to="/" className="nav-brand">
      <a className="navbar-brand" href="#" style={{ letterSpacing: '2px' }}>
        genero<span style={{ color: 'gray', letterSpacing: '3px' }}>city</span>
      </a>
    </NavLink>
  );

  const mainNavOptions = (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/messages" className="nav-link">
          Messages
        </NavLink>
      </li>
    </ul>
  );
  const filterBox = (
    <div id="filterBox">
      <select
        className="form-control"
        id="exampleFormControlSelect1"
        name="itemCategory"
        value={props.displayCat}
        onChange={(e) => {
          props.handleFilterChange(e);
        }}
      >
        <option value="All">All Categories</option>
        <option value="Appliances">Appliances</option>
        <option value="Plants">Plants</option>
        <option value="Sports">Sports</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>
    </div>
  );

  {
    /* NOT SURE WHAT THIS DOES VVV
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button> */
  }

  const userOptions = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <NavLink to="/" onClick={props.handleLogout} className="nav-link" style={{ marginRight: '10px' }}>
          Log Out
        </NavLink>
      </li>
    </ul>
  );

  if (props.from === 'landing' || props.from === 'login' || props.from === 'signup') {
    return (
      <nav className="navbar navbar-expand-md navbar-light" style={{ backgroundColor: '#e4f3fe' }}>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {logoBtn}
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light" style={{ backgroundColor: '#e4f3fe' }}>
      {logoBtn}
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {mainNavOptions}
        {filterBox}
        {userOptions}
      </div>
    </nav>
  );
};

export default withRouter(Nav);

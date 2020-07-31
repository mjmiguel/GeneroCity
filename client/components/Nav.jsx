import React, { Component } from 'react';
import '../scss/app.scss';
import { Route, Switch, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

const Nav = (props) => {
  const logoBtn = (
    <NavLink to="/" className="nav-brand">
      <span className="navbar-brand" style={{ letterSpacing: '2px' }}>
        genero<span style={{ color: 'gray', letterSpacing: '3px' }}>city</span>
      </span>
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
      <li className="nav-item">
        <NavLink to="/available" className="nav-link">
          Available Now
        </NavLink>
      </li>
    </ul>
  );

  const searchBar = (
    <div id="searchBar">
      <input name="searchbar" type="text" placeholder="Search items by name"></input>
      <button id="searchBtn" htmlFor="searchbar" type="submit">
        Search
      </button>
    </div>
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

  if (props.from === 'profile' || props.from === 'messages' || props.from === 'chat') {
    return (
      <nav className="navbar navbar-expand-md navbar-light" style={{ backgroundColor: '#e4f3fe' }}>
        {logoBtn}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {mainNavOptions}
          {userOptions}
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
        {searchBar}
        {userOptions}
      </div>
    </nav>
  );
};

export default withRouter(Nav);

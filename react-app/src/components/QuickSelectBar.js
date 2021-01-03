import React from 'react';
import {NavLink} from 'react-router-dom';

const QuickSelectBar = () => {
  return (
    <div className="quick-select">
      <div className="quick-select__container">
        <div className="quick-select__content-wrapper">
          <div className="quick-select__bookend"></div>
          <nav className="quick-select__navigation">
            <ul className="quick-select__navigation-list">
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/art" className="quick-select__navigation-navlink">Arts</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/comics+illustration" className="quick-select__navigation-navlink">Comics & Illustration</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/design+tech" className="quick-select__navigation-navlink">Design & Tech</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/film" className="quick-select__navigation-navlink">Film</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/food+craft" className="quick-select__navigation-navlink">Food & Craft</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/games" className="quick-select__navigation-navlink">Games</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/music" className="quick-select__navigation-navlink">Music</NavLink>
              </li>
              <li className="quick-select__navigation-link">
                <NavLink to="/discover/publishing" className="quick-select__navigation-navlink">Publishing</NavLink>
              </li>
            </ul>
          </nav>
          <div className="quick-select__bookend"></div>
        </div>
      </div>
    </div>
  )
}

export default QuickSelectBar;
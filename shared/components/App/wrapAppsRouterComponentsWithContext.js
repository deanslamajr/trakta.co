import React from 'react';
import PropTypes from 'prop-types';

import AsyncRecorder from './AsyncRecorder';
import AsyncMain from './AsyncMain';

import App from './App';

function wrapComponentWithContext(Component, insertCss) {
  /*
  * Adds isomorphic-style-loader functionality to all children via React context API
  */
  class ContextWrappedApp extends React.Component {
    getChildContext() {
      return {
        insertCss
      };
    }

    render(props) {
      return ( <Component {...props} /> );
    }
  }

  ContextWrappedApp.childContextTypes = {
    insertCss: PropTypes.func.isRequired
  };

  return ContextWrappedApp;
}

export default function wrapAppsRouterComponentsWithContext(insertCssLambda) {
  /*
   * isomorphic-style-loader wrapped components
   */
  const ContextWrappedAsyncRecorder = wrapComponentWithContext(AsyncRecorder, insertCssLambda);
  const ContextWrappedAsyncMain = wrapComponentWithContext(AsyncMain, insertCssLambda);

  return App({ 
    ContextWrappedAsyncRecorder, 
    ContextWrappedAsyncMain 
  });
}
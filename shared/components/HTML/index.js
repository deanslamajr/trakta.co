/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/html-has-lang */

import React from 'react';
import PropTypes from 'prop-types';

function addStyles(css) {
  return (
    <style type="text/css">{[...css].join('')}</style>
  )
}

/**
 * The is the HTML shell for our React Application.
 */
function HTML(props) {
  const { css, htmlAttributes, headerElements, bodyElements, appBodyString } = props;

  return (
    <html {...htmlAttributes}>
      <head>
        {headerElements}
        { 
          css && css.size
            ? addStyles(css)
            : null
        }
      </head>
      <body style={{ backgroundColor: '#333333' }} >
        <div id="app" dangerouslySetInnerHTML={{ __html: appBodyString }} />
        {bodyElements}
      </body>
    </html>
  );
}

HTML.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  htmlAttributes: PropTypes.object,
  headerElements: PropTypes.node,
  bodyElements: PropTypes.node,
  appBodyString: PropTypes.string,
};

HTML.defaultProps = {
  htmlAttributes: null,
  headerElements: null,
  bodyElements: null,
  appBodyString: '',
};

// EXPORT

export default HTML;

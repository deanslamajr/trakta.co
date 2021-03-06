import React from 'react'
import Helmet from 'react-helmet'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import { Provider } from 'react-redux'

import config from '../../../config'

import configureStore from '../../../shared/redux/configureStore'

import initializeReduxState from './initializeReduxState'
import ServerHTML from './ServerHTML'
import App from '../../../shared/components/App'

async function initializeReactApplication (req, res) {
  const nonce = res.locals.nonce

  // Create the redux store.
  const store = configureStore()

  await initializeReduxState(store, req, res)

  // We're using this outer context to store all server-rendered css for injection in server rendered header style tag
  // necessary configuration to support isomorphic-style-loader
  const css = new Set()
  const insertCssLambda = (styles) => css.add(styles._getCss())

  // Create a context for our AsyncComponentProvider.
  const asyncComponentsContext = createAsyncContext()

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {}

  // Declare our React application.
  const app = (
    <AsyncComponentProvider asyncContext={asyncComponentsContext}>
      <StaticRouter location={req.url} context={reactRouterContext}>
        <Provider store={store}>
          <App insertCssLambda={insertCssLambda} />
        </Provider>
      </StaticRouter>
    </AsyncComponentProvider>
  )

  // Pass our app into the react-async-component helper so that any async
  // components are resolved for the render.
  return asyncBootstrapper(app).then(() => {
    const appString = renderToString(app)

    // Generate the html response.
    const html = renderToStaticMarkup(
      <ServerHTML
        css={css}
        reactAppString={appString}
        nonce={nonce}
        helmet={Helmet.rewind()}
        storeState={store.getState()}
        asyncComponentsState={asyncComponentsContext.getState()}
      />
    )

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      res.status(302).setHeader('Location', reactRouterContext.url)
      res.end()
      return
    }

    res.status(
        // If the renderResult contains a "missed" match then we set a 404 code.
        // Our App component will handle the rendering of an Error404 view.
        // Otherwise everything is all good and we send a 200 OK status.
        reactRouterContext.missed
          ? 404
          : 200
      )
      .send(`<!DOCTYPE html>${html}`)
  })
}

/**
 * React application middleware, supports server side rendering.
 */
export default function reactApplicationMiddleware (request, response) {
  const nonce = response.locals.nonce
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response')
  }

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR')
    }

    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML nonce={nonce} />)
    response.status(200).send(`<!DOCTYPE html>${html}`)
    return
  }

  /**
   * Begin SSR of application
   */
  initializeReactApplication(request, response)
}

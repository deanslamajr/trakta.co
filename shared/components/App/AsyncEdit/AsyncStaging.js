import { asyncComponent } from 'react-async-component'

export default asyncComponent({
  resolve: () => System.import(/* webpackChunkName: "staging" */ '../../../../client/components/Staging'),
  serverMode: 'defer'
})

import { asyncComponent } from 'react-async-component'

export default asyncComponent({
  resolve: () => System.import(/* webpackChunkName: "cleanup" */ '../../../../client/components/Cleanup'),
  serverMode: 'defer'
})

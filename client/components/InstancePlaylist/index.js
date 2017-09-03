import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  resolve: () => System.import(/* webpackChunkName: "instancePlaylist" */ './InstancePlaylist'),
  // stop the server-renderer's react tree walker from rendering any children of this component 
  // because past here there be dragons (client only code)
  serverMode: 'defer'
});
import Players from './Players'
import Samples from './Samples'
import Traks from './Traks'
import SampleInstances from './Sample-Instances'

Players.hasMany(Samples);
Players.hasMany(Traks, { foreignKey: 'originators_player_id' });

Traks.hasMany(SampleInstances);

SampleInstances.belongsTo(Players);
SampleInstances.belongsTo(Samples);

export {
    Players,
    Samples,
    Traks,
    SampleInstances
}
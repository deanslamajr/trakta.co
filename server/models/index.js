import Players from './Players'
import PlayCodes from './Play-Codes'
import Samples from './Samples'
import Traks from './Traks'
import SampleInstances from './Sample-Instances'

Players.hasMany(Samples)
Players.hasMany(Traks, { foreignKey: 'originators_player_id' })
Samples.hasMany(SampleInstances)
Traks.hasMany(SampleInstances)

SampleInstances.belongsTo(Samples)
SampleInstances.belongsTo(Players)
SampleInstances.belongsTo(Traks)

export {
    Players,
    Samples,
    Traks,
    SampleInstances,
    PlayCodes
}

import Players from './Players'
import PlayCodes from './Play-Codes'
import Samples from './Samples'
import Traks from './Traks'
import SampleInstances from './Sample-Instances'
import Versions from './Versions'

Players.hasMany(Samples)
Players.hasMany(Traks, { foreignKey: 'originators_player_id' })
Samples.hasMany(SampleInstances)
Traks.hasMany(SampleInstances)
Traks.hasMany(Versions)

SampleInstances.belongsTo(Samples)
SampleInstances.belongsTo(Players)
SampleInstances.belongsTo(Traks)
SampleInstances.belongsTo(Versions)

Versions.belongsTo(Traks)

export {
  PlayCodes,
  Players,
  SampleInstances,
  Samples,
  Traks,
  Versions
}

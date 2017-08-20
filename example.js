const MapPlot = require('./index')
const curve = MapPlot("walk.svg").then(curve=>{
  console.log(curve);
})
const fs = require("fs")
var jsspline = require("js-spline")
const Promise = require("bluebird")
const _ = require("lodash")
const { parseSVG, makeAbsolute } = require("svg-path-parser")
const parseString = Promise.promisify(require("xml2js").parseString)

const PlotPoints = (path, opt = {}) => {
  const options = Object.assign({}, { steps: 100 }, opt)

  const svg = fs.readFileSync(path, "utf-8")

  return parseString(svg).then(result => {

    const points = _.flatten(
      makeAbsolute(
        parseSVG(result.svg["defs"][0].path[0]["$"].d)
      ).map((p, i) => {
        if (i === 0) {
          return [
            { x: p["x0"], y: p["y0"] },
            { x: p["x"], y: p["y"] },
          ]
        } else {
          return { x: p["x"], y: p["y"] }
        }
      })
    )

    var curve = new jsspline.Bezier({
      steps: options.steps, // number of interpolated points between 4 way points
    })

    for (var i = 0; i < points.length; ++i) {
      curve.addWayPoint({
        x: points[i].x,
        y: points[i].y,
        z: 0.0,
      })
    }
    return curve
  })
}

module.exports = PlotPoints

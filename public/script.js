const CONFIG = {
  scatterRadius: 15,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width: 900,
  height: 600
};

let height = CONFIG.height - CONFIG.margin.top - CONFIG.margin.bottom;
let width = CONFIG.width - CONFIG.margin.left - CONFIG.margin.right;
let main, data, mainSVG = null;


let xScale, yScale, radiusScale, colorScale, xScalePosition, yScalePosition = null;
let selectedMetric = "Qualification Results";

window.onload = () => {
  main = d3.select("#main");
  title = d3.select("#title");
  console.log("==> STARTED");
  parseData(draw);
};



function parseData(drawFn) {
  console.log("==> parseData()");
  d3.json("positions.json").then((d) => {
    data = d;
    console.log("==> imported", data);

    configureScales();
    drawFn();
  });
}

function configureScales() {

  console.log('dddd', [CONFIG.margin.left, width])
  xScale = d3.scaleLinear()
    .domain([0, getProperty(selectedMetric).length])
    .range([0, CONFIG.width]);

  xScalePosition = d3.scaleLinear()
    .domain([d3.min(getProperty("Race Results")), d3.max(getProperty(selectedMetric))])
    .range([0, width - (CONFIG.margin.left * 2)]);


  yScalePosition = d3.scaleLinear()
    .domain([d3.min(getProperty("Position")), d3.max(getProperty("Position"))])
    .range([30, height - (CONFIG.margin.top * 3)]);

  yScale = d3.scaleLinear()
    .domain([0, getProperty(selectedMetric).length])
    .range([CONFIG.margin.top, height]);


  radiusScale = d3.scaleLinear()
    .domain([d3.min(getProperty(selectedMetric)), d3.max(getProperty(selectedMetric))])
    .range([5, CONFIG.maxRadius]);

  colorScale = d3.scaleLinear()
    .domain([d3.min(getProperty(selectedMetric)), d3.max(getProperty(selectedMetric))])
    .range([0.8, 0.9])
    .interpolate((s) => d3.interpolateBlues);

}

function getProperty(property) {
  return data.map((dataPoint) => dataPoint[property]).slice(0, 10);
}
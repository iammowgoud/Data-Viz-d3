const CONFIG = {
  scatterRadius: 15,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width: 900,
  height: 550
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

  document.onkeydown = (event) => {
    if (event.keyCode == '40') {
      next();
    }
  };
};



function parseData(drawFn) {
  console.log("==> parseData()");
  d3.json("positions.json").then((d) => {
    data = d;
    console.log("==> imported", data);

    currentStep = "draw";
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

let steps = ["draw", "bar", "scatter", "dumbell", "reset"];
let fns = [draw, bar, scatter, dumbell, reset];
let currentStep = null;

function next() {
  let currIndex = steps.indexOf(currentStep);
  if (currIndex === steps.length - 1) {
    console.log("DONE")
  } else {
    currIndex++;
    currentStep = steps[currIndex];
    console.log(currentStep);
    fns[currIndex]();
  }
}

function reset() {
  mainSVG.remove();
  currentStep = "draw";
  draw();
}


function stopPulse() {
  els = document.querySelectorAll(".pulse");
  els[0].classList.toggle("pulse")
  els[1].classList.toggle("pulse")
}

// function attachTooltips() {
//   mainSVG
//     .append("text")
//     .classed("hide", true)
//     .attr("id", "tooltip");

//   mainSVG.selectAll(".avatar")
//     .on("mouseenter", handleMouseOver)
//     .on("mouseout", handleMouseOut);
// }


// function handleMouseOver(d, i) { // Add interactivity
//   var x = this.getAttribute("cx");
//   var y = this.getAttribute("cy");

//   mainSVG.select("#tooltip")
//     .attr("x", x )
//     .attr("y", y )
//     .text("test")
//     .classed("hide", false)

// }

// function handleMouseOut(d, i) {
//   mainSVG.select("#tooltip")
//     .classed("hide", true)
// }
const CONFIG = {
  scatterRadius: 15,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width: 900,
  height: 530
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
  location.reload();
}


function stopPulse() {
  els = document.querySelectorAll(".pulse");
  els[0].classList.toggle("pulse")
  els[1].classList.toggle("pulse")
  document.querySelector(".arrow").remove();
}

function attachTooltips() {

  mainSVG.selectAll(".avatar")
    .on("mouseenter", handleMouseOver)
    .on("mouseout", handleMouseOut);
}


function handleMouseOver(d, i) { // Add interactivity
  var x = this.getAttribute("cx");
  var y = this.getAttribute("cy");
  var pilot = this.getAttribute("pilot");
  var dumbell = this.getAttribute("class").includes("dumbell");

  if (dumbell) {
    var text = "Race: " + Math.round(d["Race Results"] * 10) / 10;

  } else {
    var text = Math.round(d[dumbell ? "Race Results" : selectedMetric] * 10) / 10;
    var text = "Qualifications: " + Math.round(d[selectedMetric] * 10) / 10;

  }

  // mainSVG.select("#x-marker")
  //   .attr("x2", x)
  //   .attr("y1", y)
  //   .attr("y2", y)
  //   .classed("hide", false);

  mainSVG.select("#y-marker")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y2", y)
    .classed("hide", false);

  mainSVG.select("#text-marker")
    .attr("x", x - (dumbell ? 20 : 70))
    .attr("y", height)
    .text(text)
    .classed("hide", false);


   mainSVG.select(".label[pilot^='" + pilot + "']")
     .classed("highlight", true);

}

function handleMouseOut(d, i) {
  var pilot = this.getAttribute("pilot");
  // mainSVG.select("#x-marker")
  //   .classed("hide", true);
  mainSVG.select("#y-marker")
    .classed("hide", true);
  mainSVG.select("#text-marker")
    .classed("hide", true);
    mainSVG.select(".label[pilot^='" + pilot + "']")
      .classed("highlight", false);
}

function getID(string) {
  return string.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
}
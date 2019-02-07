function addDefs() {
  var defs = mainSVG.append("defs");

  defs.selectAll(null)
    .data(data)
    .enter()
    .append("pattern")
    .attr("id", (d) => d["Pilot"].replace(/^[^a-z]+|[^\w:.-]+/gi, ""))
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", function (d) {
      return "imgs/" + (d["image"] || "pp.png")
    });
}

function draw() {
  console.log("==> draw()");

  title.text("Formula E Pilots");

  // Main Viz
  main.style("max-width", `${CONFIG.width}px`)
    .style("margin", "0 auto")

    // Main SVG
    .append("svg")
    .attr("id", "mainSVG")
    .attr("width", width + CONFIG.margin.left + CONFIG.margin.right)
    .attr("height", height + CONFIG.margin.top + CONFIG.margin.bottom)


  mainSVG = d3.select("#mainSVG");

  addDefs();

  // Circles Group
  mainSVG
    .append("g")
    .attr("id", "avatar-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .classed("avatar", true)

    // Circle attrs
    .attr("cx", (d, i) => xScale(i))
    .attr("cy", CONFIG.margin.top)
    .attr("fill", d => "url(#" + d["Pilot"].replace(/^[^a-z]+|[^\w:.-]+/gi, "") + ")")
    .attr("r", 35);
  // .attr("stroke", "black");

  mainSVG
    .append("g")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.right + ")")

    .selectAll("text")
    .data(data)
    .enter().append("text")
    .classed("label", true)
    .text((d, i) => d["Pilot"])
    // .attr("transform", "translate(-25, 0)")

    .attr("x", (d, i) => (xScale(i) - 20) + "px")
    .attr("y", "110px")
    .attr("dominantBaseline", "middle")
    .attr("textAnchor", "middle");
}

function bar() {
  console.log("==> draw()");

  title.text("Ranked 1st");

  var delay = 50;
  var duration = 800;


  mainSVG
    .selectAll("circle")
    .transition()
    .attr("cy", (d, i) => height - CONFIG.margin.bottom)
    .delay((d, i) => {
      return i * delay;
    })
    .duration(duration)
    .ease(d3.easeQuad);

  mainSVG
    .selectAll("text")
    .transition()
    .attr("y", (d, i) => height + 10 + "px")
    .delay((d, i) => {
      return i * delay;
    })
    .duration(duration)
    .ease(d3.easeQuad);


  //Bars

  mainSVG
    .append("g")
    .attr("id", "bar")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
    .classed("bar", true)

    // Circle attrs
    .attr("x", (d, i) => xScale(i) - 10)
    .attr("y", (d, i) => height - 100)
    .attr("height", (d, i) => 0)
    .attr("width", "20px")
    .attr("fill", "red")

    .transition()
    .attr("y", (d, i) => yScale(i - 1))
    .attr("height", (d, i) => Math.abs(height - yScale(i - 1) - 100))
    .delay((d, i) => {
      return duration + (i * delay);
    })
    .duration(duration)
    .ease(d3.easeQuad);
}


function fall() {
  title.text("Qualification Results");

  var delay = 50;
  var duration = 800;

  mainSVG
    .selectAll("rect")
    .transition()
    .attr("y", 0)
    .attr("height", 0)
    .delay((d, i) => {
      return ((i - 1) * delay);
    })
    .duration(duration)
    .ease(d3.easeQuad);


  setTimeout(() => {
    mainSVG
      .selectAll("#bar")
      .remove();
  }, duration + 10);

  mainSVG
    .selectAll("text")
    .transition()
    // Circle attrs
    .attr("x", "0px")
    .attr("y", (d, i) => yScale(i) + "px")

    .delay((d, i) => {
      return duration + (i * 50);
    })
    .duration(duration)
    .ease(d3.easeSinInOut);

  // setttimeout to run on the next event loop
  setTimeout(() => {
    mainSVG
      .selectAll("text")
      .classed("x-axis", true);
  }, 2000);

  mainSVG
    .selectAll("#avatar-group circle")
    .transition()
    .attr("cy", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("r", CONFIG.scatterRadius)
    .delay((d, i) => {
      return (duration * 2) + (i * 50);
    })
    .duration(duration)
    .ease(d3.easeSinInOut);
}



function dumbell() {
  title.text("Qualification Results Vs. Race Results");


  // lines
  mainSVG
    .append("g")
    .attr("id", "dumbell-line-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init lines
    .selectAll("line")
    .data(data)
    .enter().insert("line", "#avatar-group")
    .classed("line", true)

    .attr("x1", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("y1", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("x2", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("y2", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))

    .attr("stroke", "black")
    .attr("stroke-width", 3)



    .transition()


    .attr("x2", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d["Race Results"]))

    .delay((d, i) => {
      return i * 50;
    })
    .duration(1000)
    .ease(d3.easeBackOut)


  // Circles Group
  mainSVG
    .append("g")
    .attr("id", "dumbell-group")
    .attr("transform", "translate(" + CONFIG.margin.left + "," + CONFIG.margin.top + ")")

    // Init Circles
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
    .classed("avatar", true)

    .attr("cy", (d, i) => yScale(i) - (CONFIG.scatterRadius / 2))
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d[selectedMetric]))
    .attr("r", CONFIG.scatterRadius)
    .attr("fill", "transparent")



    .transition()
    // Circle attrs
    .attr("cx", (d, i) => (CONFIG.margin.left * 2) + xScalePosition(d["Race Results"]))
    .attr("fill", "red")
    .delay((d, i) => {
      return i * 50;
    })
    .duration(1000)
    .ease(d3.easeBackOut)

}

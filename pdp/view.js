//Nécessite D3JS V4 :  <script src="https://d3js.org/d3.v4.js"></script>
//Template utilisé : https://www.d3-graph-gallery.com/graph/parallel_custom.html
// data : sepale/petale etc.


// ---> Lignes de commande pour envoyer une requête au serveur
function setupListener(){
    let button=document.getElementById("submit");
    button.addEventListener("click",doSubmit);
}

function doSubmit(){
    let input=document.getElementById("file");

    let request=new XMLHttpRequest();
    request.open('POST',"http://localhost:3000/graphs");
    request.send(input.textContent);
}

window.addEventListener("load",setupListener);
//----------

// set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 10, left: 0},
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".wrapper")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {
  // ---> Color scale: give me a specie name, I return a color
   var color = d3.scaleOrdinal()
     .domain(["setosa", "versicolor", "virginica" ])
     .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species

  // dimensions = d3.keys(data[0]).filter(function(d) { return d != "Species" })
  dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"];


  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain([0,8])
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

// Highlight the specie that is hovered
var highlight = function(d){
  selected_specie = d.Species

  // first every group turns grey
  d3.selectAll(".line")
    .transition().duration(200)
    .style("stroke", "lightgrey")
    .style("opacity", "0.2")
  // Second the hovered specie takes its color
  d3.selectAll("." + selected_specie)
    .transition().duration(200)
    .style("stroke", color(selected_specie))
    .style("opacity", "1")
}

// Unhighlight
var doNotHighlight = function(d){
  d3.selectAll(".line")
    .transition().duration(200).delay(1000)
    .style("stroke", function(d){ return( color(d.Species))} )
    .style("opacity", "1")
}


  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
    .attr("class", function (d) { return "line " + d.Species } )
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("opacity", 0.5)
    .on("mouseover",highlight)
    .on("mouseleave",doNotHighlight)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class","axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

})

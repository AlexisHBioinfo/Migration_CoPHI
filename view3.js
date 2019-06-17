// Script made by CLAUDE Elsa, HUCTEAU Alexis, GARCIA Juan Manuel
// 09/05/2019
// Javascript migration of CoPHI web application
// Based on:
    // parallel sets template on http://oer.uoc.edu/VIS/D3/CA/parallel-sets/index.html

var upload = false;
var vis = d3.select(".wrapper").append("svg");
var zooming=true;
document.getElementById("Zoom").className="clicked";
var scaling=false;
var deleteAxis=false;
var insertDimension=false;
var moving=false;
var filtering=false;
var select=false;
var butZoom=document.getElementsByClassName("zoom");
var butScale=document.getElementsByClassName("scale");
var butDeleteAxis=document.getElementsByClassName("delete");
var butInsertDimension=document.getElementsByClassName("insert");
var butMove=document.getElementsByClassName("axis");
var butFilter=document.getElementsByClassName("filter");
var butSelect=document.getElementsByClassName("selected");

butZoom[0].addEventListener("click", function(){
  zooming=!zooming;
  scaling=false;
  deleteAxis=false;
  insertDimension=false;
  moving=false;
  filtering=false;
  select=false;
  if (zooming==true){
    document.getElementById("Zoom").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
  }
  else{
    document.getElementById("Zoom").classList.remove("clicked");
  }
});

butScale[0].addEventListener("click",function(){
  scaling=!scaling;
  zooming=false;
  deleteAxis=false;
  insertDimension=false;
  moving=false;
  filtering=false;
  select=false;
  if (scaling==true){
    document.getElementById("Scale").className="clicked";
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
  }
  else{
    document.getElementById("Scale").classList.remove("clicked");
  }
});

butDeleteAxis[0].addEventListener("click",function(){
  deleteAxis=!deleteAxis;
  zooming=false;
  scaling=false;
  insertDimension=false;
  moving=false;
  filtering=false;
  select=false;
  if (deleteAxis==true){
    document.getElementById("deleteAxis").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
  }
  else{
    document.getElementById("deleteAxis").classList.remove("clicked");
  }
});

butInsertDimension[0].addEventListener("click",function(){
  insertDimension=!insertDimension;
  zooming=false;
  scaling=false;
  deleteAxis=false;
  moving=false;
  filtering=false;
  select=false;
  if (insertDimension==true){
    document.getElementById("insertDimension").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
  }
  else{
    document.getElementById("insertDimension").classList.remove("clicked");
  }
});

butMove[0].addEventListener("click",function(){
  moving=!moving;
  zooming=false;
  scaling=false;
  deleteAxis=false;
  insertDimension=false;
  filtering=false;
  select=false;
  if (moving==true){
    document.getElementById("move").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
  }
  else{
    document.getElementById("move").classList.remove("clicked");
  }
});

butSelect[0].addEventListener("click", function(){
  zooming=false;
  scaling=false;
  deleteAxis=false;
  insertDimension=false;
  moving=false;
  filtering=false;
  select=!select;
  if (select==true){
    document.getElementById("select").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("filter").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
  }
  else{
    document.getElementById("select").classList.remove("clicked");
  }
});


butFilter[0].addEventListener("click", function(){
  filtering=!filtering;
  select=false;
  zooming=false;
  scaling=false;
  deleteAxis=false;
  insertDimension=false;
  moving=false;
  if (filtering==true){
    document.getElementById("filter").className="clicked";
    document.getElementById("Scale").classList.remove("clicked");
    document.getElementById("deleteAxis").classList.remove("clicked");
    document.getElementById("insertDimension").classList.remove("clicked");
    document.getElementById("Zoom").classList.remove("clicked");
    document.getElementById("move").classList.remove("clicked");
    document.getElementById("select").classList.remove("clicked");
  }
  else{
    document.getElementById("filter").classList.remove("clicked");
  }
});

function zoomed() {
  back.attr("transform", d3.event.transform);
}

function guessDelimiters (text, possibleDelimiters) {
  return possibleDelimiters.filter(weedOut);

  function weedOut (delimiter) {
      var cache = -1;
      return text.split('\n').every(checkLength);

      function checkLength (line) {
          if (!line) {
              return true;
          }

          var length = line.split(delimiter).length;
          if (cache < 0) {
              cache = length;
          }
          return cache === length && length > 1;
      }
  }
}

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

window.onscroll = function() {myFunction()};

var navbar = document.getElementById("toolBar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;
navbar.setAttribute("width","100");

var color = "GRN";
console.log(vis);
d3.select("#GB").on("click", function() {
  color ="GB";
  if (upload==true) {
    vis.svg.updateDimensions();
  }
});
d3.select("#GRN").on("click", function() {
  color ="GRN";
  if (upload==true) {
    vis.svg.updateDimensions();
  }
});
d3.select("#L").on("click", function() {
  color ="L";
  if (upload==true) {
    vis.svg.updateDimensions();
  }
});
d3.select("#BR").on("click", function() {
  color ="BR";
  if (upload==true) {
    vis.svg.updateDimensions();
  }
});
d3.select("#P").on("click", function() {
  color ="P";
  if (upload==true) {
    vis.svg.updateDimensions();
  }
});

d3.select("#submit").on("click", function() {
  let fich=document.getElementById("file");
  var file = fich.files[0],
      reader = new FileReader;
  reader.onloadend = function() {
    var lignes=reader.result.split('\n');
    let separateur=guessDelimiters(lignes[1],[" ",",","\t",";"]);
    if (separateur.length>1){
      separateur=separateur.pop();
    }
    else{
      separateur=separateur[0];
    }
    var del=d3.dsv(separateur,"text/plain");
    var csv=del.parse(reader.result);
    let j=-1;
    csv.forEach(function(line){
      delete line[''];
    });
    for (let i in csv[0]){
      j++;
    }
    function tabulate(data, columns) {
      var table = d3.select('.content').append('table')
      var thead = table.append('thead')
      var	tbody = table.append('tbody');
      // append the header row
      thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; });
      // create a row for each object in the data
      var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
      // create a cell in each row for each column
      var cells = rows.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]};
          });
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value; });
      var coll=document.getElementsByClassName("collapsible");
      for (let i=0; i<coll.length;i++){
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.display === "block") {
            content.style.display = "none";
          }
          else {
            content.style.display = "block";
            content.style.top=(window.innerHeight-12)+"px";
          }
        });
      }
    }
    var parsed=del.parseRows(reader.result);
    tabulate(csv,parsed[0]);
    var chart = d3.parsets()
      .dimensions([""])
      .width(750)
      .height(50*j)
      .tension(0.25);
    upload=true;
    var wi=chart.width();
    var he=chart.height();
    var leftTools = d3.select(".left-tools");
    leftTools.style("width", wi+"px");
    let coordonneeRotation = function(){
      let x,y;
      if (wi<he){
        x=0;
        y=-((he/2)-wi/2);
      }
      else if (he<wi){
        x=-((wi/2)-he/2);
        y=0;
      }
      else {
        x=0;
        y=0;
      }
      return [x,y];
    }
    var coll=d3.select(".collapsible");
    var wrap=d3.select(".wrapper");
    var coord=coordonneeRotation(wi,he);
    var xrotation=coord[0];
    var yrotation=coord[1];
    vis.datum(csv).call(chart
      .value(csv[0].hasOwnProperty("Number") ? function(d) { return +d.Number; } : 1)
      .dimensions(function(d) { return d3.keys(d[0]).filter(function(d) { return d !== "Number"; }); }))
      .attr("width", wi)
      .attr("height", he)
      .attr('transform', 'rotate(-90, '+xrotation+', '+yrotation+')');
      if (he<wi) {
        vis.style("top", 150+"px");
        var table=d3.select('.resultsTable');
        table.style("top", 150+"px");
      }
      var coord_in=[];
      let aggr=d3.selectAll("g").filter(".dimension");
      aggr[0].forEach(element => {
        let t=d3.transform(d3.select(element).attr("transform")).translate;
        coord_in.push(t[1]);
      });
      var zoom=d3.behavior.zoom()
        .scaleExtent([1/4,8])
        .on("zoom", function(){
          if (zooming==false) return;
          var e=d3.event;
          if (e.scale >= 1) {
            let tmp=(e.scale-1)/4;
            e.scale=1+tmp;
          }
          if (e.scale < 1){
            let tmp=(1-e.scale)/4;
            e.scale=1-tmp;
          }
          let g=d3.select("g");
          g.attr("transform", [`scale(${e.scale})`].join(" "));
          let aggr=d3.selectAll("g").filter(".dimension");
          var cont=0;
          aggr[0].forEach(element => {
            let t=d3.transform(d3.select(element).attr("transform")).translate;
            t[1]=coord_in[cont]*e.scale;
            d3.select(element).attr("transform",[`translate(${t[0]},${t[1]}) scale(${e.scale})`].join(" "));
            cont+=1;
          });
        });

    vis.call(zoom)
      .on("mousedown.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);
    }
  reader.readAsText(file);
});

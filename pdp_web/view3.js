var vis = d3.select(".wrapper").append("svg");
var select=false;
var but1=document.getElementsByClassName("selected");
but1[0].addEventListener("click", function(){
      select=!select;
      console.log(select)
    });

var zooming=false;

var but2=document.getElementsByClassName("zoom");
but2[0].addEventListener("click", function(){
  zooming=!zooming;
  console.log(zooming);
  select=false;
});

var moving=false;
var but3=document.getElementsByClassName("axis");
but3[0].addEventListener("click", function(){
  moving=!moving;
  console.log(moving);
  select=false;
  zooming=false;
});
// Given a text function and width function, truncates the text if necessary to
// fit within the given width.
function truncateText(text, width) {
  return function(d, i) {
    var t = this.textContent = text(d, i),
        w = width(d, i);
    if (this.getComputedTextLength() < w) return t;
    this.textContent = "…" + t;
    var lo = 0,
        hi = t.length + 1,
        x;
    while (lo < hi) {
      var mid = lo + hi >> 1;
      if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
      else hi = mid;
    }
    return lo > 1 ? t.substr(0, lo - 2) + "…" : "";
  };
}

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

d3.select("#submit").on("click", function() {
  let fich=document.getElementById("file");
  var file = fich.files[0],
      reader = new FileReader;
  reader.onloadend = function() {

    var lignes=reader.result.split('\n');
    let separateur=guessDelimiters(lignes[1],[" ",",","\t",";"]);

    if (separateur.length>0){
        separateur=separateur.pop();

    }
    else{
      separateur=separateur[0];
    }

    var del=d3.dsv(separateur,"text/plain");
    var csv=del.parse(reader.result);
    let j=-1;
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
          } else {
            content.style.display = "block",
            content.style.top=wi+150+"px";
          }
        });
      }
      // return table;
    }
    var parsed=del.parseRows(reader.result);
    // console.log(parsed);
    tabulate(csv,parsed[0]);
    var chart = d3.parsets()
      .dimensions([""])
      .width(750)
      .height(75*j)
      .tension(0.25);

    var wi=chart.width();
    var he=chart.height();
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
    coll.style("top", wi+100+"px");
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
        var scale=1;
       var zoom=d3.behavior.zoom()
              .scaleExtent([-50,50])
              .on("zoom", function(){
                if (zooming==false) return;
                var e=d3.event;

                let g=d3.select("g");
                console.log(g);         
                g.attr("transform", [`scale(${e.scale})`].join(" "));
                d3.select(".ribbon-mouse").attr("transform", [`scale(${e.scale})`].join(" "));
                let aggr=d3.selectAll("g").filter(".dimension");
                console.log(aggr);
                aggr[0].forEach(element => {
                  let t=d3.transform(d3.select(element).attr("transform")).translate;

                  t[0]+=Math.min(0,Math.max(e.translate[0],wi-wi*e.scale));
                  let temp=t[1]*(e.scale/scale); // arreglar esta parte 
                  temp>5? t[1]=temp : t[1]=t[1];
                  d3.select(element).attr("transform",[`translate(${t[0]},${t[1]}) scale(${e.scale})`].join(" "));
                  console.log(element);
                  
                });
              });

      
      vis.call(zoom)
      .on("mousedown.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);
      scale=e.scale; 
      
    }
  reader.readAsText(file);
  // console.log(reader);
  

});


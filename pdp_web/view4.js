let zoom=100;
d3.select("#submit").on("click", function() {
  test(zoom,true);
});

var test=function(zoom,data_affiche){
  d3.select(".wrapper").select("svg").remove();
var vis = d3.select(".wrapper").append("svg");

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
    if (data_affiche){
      tabulate(csv,parsed[0]);
    }
    var chart = d3.parsets()
      .dimensions([""])
      .width(750)
      .height(zoom*j)
      .tension(0.25);

    let wi=chart.width();
    let he=chart.height();
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
    let coord=coordonneeRotation(wi,he);
    let xrotation=coord[0];
    let yrotation=coord[1];
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
        };
    }

  reader.readAsText(file);
  // console.log(reader);



}
d3.select("#zoom").on("click",function (){
  console.log("hello");
  zoom=zoom*(4/3);
  test(zoom,false);
})

d3.select("#dezoom").on("click",function (){
  console.log("goodbye"+zoom);
  zoom=zoom*(3/4);
  test(zoom,false);
})

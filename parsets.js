// Script made by CLAUDE Elsa, HUCTEAU Alexis, GARCIA Juan Manuel
// 09/05/2019
// Javascript migration of CoPHI web application
// Based on :
  // parsets template by Jason Davies, http://www.jasondavies.com/
  // Functionality based on http://eagereyes.org/parallel-sets


(function() {
  d3.parsets = function() {
    var event = d3.dispatch("sortDimensions", "sortCategories"),
        dimensions_ = autoDimensions,
        dimensionFormat = String,
        tooltip_ = defaultTooltip,
        categoryTooltip = defaultCategoryTooltip,
        value_,
        spacing = 200, // Space between categories
        width,
        height,
        tension = 1,
        tension0,
        duration = 500;


    function parsets(selection) {
      selection.each(function(data, i) {
        var g = d3.select(this),
            ordinal = d3.scale.ordinal(),
            dragging = false,
            dimensionNames = dimensions_.call(this, data, i),
            dimensions = [],
            tree = {children: {}, count: 0},
            nodes,
            total,
            ribbon;

        d3.select(window).on("click.parsets." + ++parsetsId, unhighlight);
        if (tension0 == null) tension0 = tension;
        g.selectAll(".ribbon, .ribbon-mouse")
            .data(["ribbon", "ribbon-mouse"], String)
          .enter().append("g")
            .attr("class", String);
        updateDimensions();
        if (tension != tension0) {
          var t = d3.transition(g);
          if (t.tween) t.tween("ribbon", tensionTween);
          else tensionTween()(1);
        }

        function tensionTween() {
          var i = d3.interpolateNumber(tension0, tension);
          return function(t) {
            tension0 = i(t);
            ribbon.attr("d", ribbonPath);
          };
        }

        function updateDimensions() { // Add dimensions based on input file
          var dimension = g.selectAll("g.dimension"), // Cache existing bound dimensions to preserve sort order.
              cache = {};
          dimension.each(function(d) {
            cache[d.name] = d;
          });
          dimensionNames.forEach(function(d) {
            if (!cache.hasOwnProperty(d)) {
              cache[d] = {name: d, categories: []};
            }
            dimensions.push(cache[d]);
          });
          dimensions.sort(compareY);
          // Populate tree with existing nodes.
          g.select(".ribbon").selectAll("path")
              .each(function(d) {
                var path = d.path.split("\0"),
                    node = tree,
                    n = path.length - 1;
                for (var i = 0; i < n; i++) {
                  var p = path[i];
                  node = node.children.hasOwnProperty(p) ? node.children[p]
                      : node.children[p] = {children: {}, count: 0};
                }
                node.children[d.name] = d;
              });
          tree = buildTree(tree, data, dimensions.map(dimensionName), value_);
          cache = dimensions.map(function(d) {
            var t = {};
            d.categories.forEach(function(c) {
              t[c.name] = c;
            });
            return t;
          });
          (function categories(d, i) {
            if (!d.children) return;
            var dim = dimensions[i],
                t = cache[i];
            for (var k in d.children) {
              if (!t.hasOwnProperty(k)) {
                dim.categories.push(t[k] = {name: k});
              }
              categories(d.children[k], i + 1);
            }
          })(tree, 0);
          ordinal.domain([]).range(d3.range(dimensions[0].categories.length));
          sortOrder();
          nodes = layout(tree, dimensions, ordinal);
          total = getTotal(dimensions);
          dimensions.forEach(function(d) {
            d.count = total;
          });
          dimension = dimension.data(dimensions, dimensionName);

          // Add dimensions to SVG element as well as their events
          var dEnter = dimension.enter().append("g")
              .attr("class", "dimension")
              .attr("transform", function(d) { return "translate(0," + d.y + ")"; })
              .on("click.parsets", cancelEvent);
          dimension.each(function(d) {
                d.y0 = d.y;
                d.categories.forEach(function(d) { d.x0 = d.x; });
              });
          dEnter.append("rect")
              .attr("width", width)
              .attr("y", -45)
              .attr("height", 45);
          var textEnter = dEnter.append("text")
              .attr("class", "dimension")
              .attr("transform", "translate(0,-15)");
          textEnter.append("tspan")
              .attr("class", "name")
              .text(dimensionFormatName);
          dimension
              .call(d3.behavior.drag()
                .origin(identity)
                .on("dragstart", function(d) {
                  if (moving==false) return;
                  d3.select(".ribbon").attr("transform","scale(1,1)");
                  d3.select(".ribbon-mouse").attr("transform","scale(1,1)");
                  dragging = true;
                  d.y0 = d.y;
                })
                .on("drag", function(d) {
                  if (moving==false) return;
                  d.y0 = d.y = d3.event.y;

                  for (var i = 1; i < dimensions.length; i++) {
                    if (height * dimensions[i].y   < height * dimensions[i - 1].y ) {
                      dimensions.sort(compareY);
                      dimensionNames = dimensions.map(dimensionName);
                      ordinal.domain([]).range(d3.range(dimensions[0].categories.length));
                      nodes = layout(tree = buildTree({children: {}, count: 0}, data, dimensionNames, value_), dimensions, ordinal);
                      total = getTotal(dimensions);
                      g.selectAll(".ribbon, .ribbon-mouse").selectAll("path").remove();
                      updateRibbons();
                      updateCategories(dimension);
                      dimension.transition().duration(duration)
                          .attr("transform", translateY)
                          .tween("ribbon", ribbonTweenY);
                      event.sortDimensions();
                      break;
                    }
                  }
                  d3.select(this)
                      .attr("transform", "translate(0," + d.y + ")")
                      .transition();
                  ribbon.filter(function(r) { return r.source.dimension === d || r.target.dimension === d; })
                      .attr("d", ribbonPath);
                })
                .on("dragend", function(d) {
                  if (moving==false) return;
                  dragging = false;
                  unhighlight();
                  var y0 = 45,
                      dy = (height - y0 - 2) / (dimensions.length - 1);
                  dimensions.forEach(function(d, i) {
                    d.y = y0 + i * dy;
                  });
                  transition(d3.select(this))
                      .attr("transform", "translate(0," + d.y + ")")
                      .tween("ribbon", ribbonTweenY);
                }));
          dimension.select("text").select("tspan.sort.alpha")
              .on("click.parsets", sortBy("alpha", function(a, b) { return a.name < b.name ? 1 : -1; }, dimension));
          dimension.transition().duration(duration)
              .attr("transform", function(d) { return "translate(0," + d.y + ")"; })
              .tween("ribbon", ribbonTweenY);
          dimension.exit().remove();
          // sortOrder();
          updateCategories(dimension);
          updateRibbons();
        }
        function sortOrder(){
          dimensions.forEach(function(i){
            var tmp_dim = {};
            var order = [];
            var tmp_dim2 = [];
            i.categories.forEach(function(j){
              tmp_dim[j.name]=j;
              order.push(j.name);
            });
            order.sort();
            for (let k=0; k<order.length;k++){
              tmp_dim2.push(tmp_dim[order[k]]);
            }
            i.categories=tmp_dim2;
          });
        }

        function sortBy(type, f, dimension) {
          return function(d) {
            var direction = this.__direction = -(this.__direction || 1);
            d3.select(this).text(direction > 0 ? type + " »" : "« " + type);
            d.categories.sort(function() { return direction * f.apply(this, arguments); });
            nodes = layout(tree, dimensions, ordinal);
            updateCategories(dimension);
            updateRibbons();
            event.sortCategories();
          };
        }




        function updateRibbons() { // Update ribbons and add events related to them
          ribbon = g.select(".ribbon").selectAll("path")
              .data(nodes);
          ribbon.enter().append("path")
              .each(function(d) {
                d.source.x0 = d.source.x;
                d.target.x0 = d.target.x;
              })
              .attr("class","ribbonNew")
              // .attr("class", function(d) { return "category-" + d.name; })
              .attr("d", ribbonPath);
          ribbon.sort(function(a, b) { return parseInt(a.name) > parseInt(b.name); });
          ribbon.exit().remove();
          var mouse = g.select(".ribbon-mouse").selectAll("path")
              .data(nodes);
          mouse.enter().append("path")
              .on("click.parsets", function(d) {
                ribbon.classed("active", false);
                if (dragging || select==false) return;
                highlight(d = d.node, true);
                showTooltip(tooltip_.call(this, d,total));
                d3.event.stopPropagation();
              });
          mouse
              .sort(function(a, b) { return b.count - a.count; })
              .attr("d", ribbonPathStatic);
          mouse.exit().remove();
        }

        // Animates the x-coordinates only of the relevant ribbon paths.
        function ribbonTweenX(d) {
          var nodes = [d],
              r = ribbon.filter(function(r) {
                var s, t;
                if (r.source.node === d) nodes.push(s = r.source);
                if (r.target.node === d) nodes.push(t = r.target);
                return s || t;
              }),
              i = nodes.map(function(d) { return d3.interpolateNumber(d.x0, d.x); }),
              n = nodes.length;
          return function(t) {
            for (var j = 0; j < n; j++) nodes[j].x0 = i[j](t);
            r.attr("d", ribbonPath);
          };
        }

        // Animates the y-coordinates only of the relevant ribbon paths.
        function ribbonTweenY(d) {
          var r = ribbon.filter(function(r) { return r.source.dimension.name == d.name || r.target.dimension.name == d.name; }),
              i = d3.interpolateNumber(d.y0, d.y);
          return function(t) {
            d.y0 = i(t);
            r.attr("d", ribbonPath);
          };
        }

        // Highlight a ribbon, its descendants and ancestors.
        function highlight(d, ancestors) {
          function getParents(d,dimensionNames){ // Calculates the parents of the selected ribbon.
            if ('parent' in d) return;
            else {
              let ind=dimensionNames.indexOf(d.dimension);
              dimensionNames=dimensionNames.slice(0,ind);
              let path=d.path.split('\u0000');
              pos_nod=nodes.filter(function(n){return n.dimension==dimensionNames[dimensionNames.length-1]});
              let par=[];
              pos_nod.forEach(function(n){
                if (n.name==path[0]){
                  par.push(n);
                }
              });

              if (par.length==0) return;
              if (par.length>0) {
                d.parent=par;
                d.parent.forEach(function(de){
                  getParents(de,dimensionNames)
                });
              }
            }
          }
          function getDescendents(d,dimensionNames){ // Calculates the descendents of the selected ribbon.
            if ('descendents' in d) return;
            else {
              let ind=dimensionNames.indexOf(d.dimension);
              dimensionNames=dimensionNames.slice(ind+1,dimensionNames.length);
              pos_nod=nodes.filter(function(n){return n.dimension==dimensionNames[0]});
              let desc=[];
              pos_nod.forEach(function(n){
                let path=n.path.split('\u0000');
                if (d.name==path[0]){
                  desc.push(n);
                }
              });
              if (desc.length==0) return;

              if (desc.length>0) {
                d.descendents=desc;
                d.descendents.forEach(function(de){
                  getDescendents(de,dimensionNames)
                });
              }
            }
          }
          if (!d.parent) getParents(d,dimensionNames);
          if (!d.descendents) getDescendents(d,dimensionNames);

          if (dragging) return;
          var highlight = [];
          (function recurse(d) {
            if (highlight.includes(d)) return;
            highlight.push(d);
            for (var k in d.descendents) recurse(d.descendents[k]);
          })(d);
          highlight.shift();
          if (ancestors) {
            (function recurse(d){
              if (highlight.includes(d)) return;
              highlight.push(d);
              for (let k in d.parent) recurse(d.parent[k]);
            })(d);
          }
          ribbon.filter(function(d) {
            var active = highlight.indexOf(d.node) >= 0;
            if (active) this.parentNode.appendChild(this);
            return active;
          }).classed("active", true);
        }

        // Unhighlight all nodes.
        function unhighlight() {
          if (dragging) return;
          ribbon.classed("active", false);
          hideTooltip();
        }

        function updateCategories(g) { // Updates dimensions' categories and adds the corresponding events
          var category = g.selectAll("g.category")
              .data(function(d) { return d.categories; }, function(d) { return d.name; });
          var categoryEnter = category.enter().append("g")
              .attr("class", "category")
              .attr("transform", function(d) { return "translate(" + d.x + ")"; });
          category.exit().remove();
          category.transition().duration(duration)
              .attr("transform", function(d) { return "translate(" + d.x + ")"; })
              .tween("ribbon", ribbonTweenX);
          categoryEnter.append("rect")
              .attr("width", function(d) { return d.dx; })
              .attr("y", -15)
              .attr("height", 15);
          // categoryEnter.append("line")
          //     .style("stroke-width", 50);
          categoryEnter.append("text")
              .attr("dy", "-.3em");
          category.select("rect")
              .attr("width", function(d) { return d.dx; })
              .attr("class", function(d) {
                if (color=="GB") { return "category-GB-" + d.name; }
                if (color=="GRN") { return "category-GRN-" + d.name; }
                if (color=="L") { return "category-L-" + d.name; }
                if (color=="BR") { return "category-BR-" + d.name; }
                if (color=="P") { return "category-P-" + d.name; }
                });
          // category.select("line")
          //     .attr("x2", function(d) { return d.dx; });
          // category.select("text")
          //     .attr("transform","rotate(90,5,-10)")
          //     .text(function(d) { return d.name; });
        }
      });
    }
    parsets.dimensionFormat = function(_) {
      if (!arguments.length) return dimensionFormat;
      dimensionFormat = _;
      return parsets;
    };

    parsets.dimensions = function(_) {
      if (!arguments.length) return dimensions_;
      dimensions_ = d3.functor(_);
      return parsets;
    };

    parsets.value = function(_) {
      if (!arguments.length) return value_;
      value_ = d3.functor(_);
      return parsets;
    };

    parsets.width = function(_) {
      if (!arguments.length) return width;
      width = +_;
      return parsets;
    };

    parsets.height = function(_) {
      if (!arguments.length) return height;
      height = +_;
      return parsets;
    };

    parsets.spacing = function(_) {
      if (!arguments.length) return spacing;
      spacing = +_;
      return parsets;
    };

    parsets.tension = function(_) {
      if (!arguments.length) return tension;
      tension = +_;
      return parsets;
    };

    parsets.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return parsets;
    };

    parsets.tooltip = function(_) {
      if (!arguments.length) return tooltip;
      tooltip_ = _ == null ? defaultTooltip : _;
      return parsets;
    };

    parsets.categoryTooltip = function(_) {
      if (!arguments.length) return categoryTooltip;
      categoryTooltip = _ == null ? defaultCategoryTooltip : _;
      return parsets;
    };

    var body = d3.select("body");
    var tooltip = body.append("div")
        .style("display", "none")
        .attr("class", "parsets tooltip");

    return d3.rebind(parsets, event, "on").value(1).width(960).height(600);

    function dimensionFormatName(d, i) {
      return dimensionFormat.call(this, d.name, i);
    }

    function showTooltip(html) {
      var m = d3.mouse(body.node());
      tooltip
          .style("display", null)
          .style("left", m[0] + 30 + "px")
          .style("top", m[1] - 20 + "px")
          .html(html);
    }

    function hideTooltip() {
      tooltip.style("display", "none");
    }

    function transition(g) {
      return duration ? g.transition().duration(duration).ease(parsetsEase) : g;
    }

    function layout(tree, dimensions, ordinal) { // Calculates the nodes used to draw the ribbons. Final list of nodes is obtained from an intermediate list that is manipulated
      var nodes = [],
          nd = dimensions.length,
          y0 = 45,
          dy = (height - y0 - 2) / (nd - 1);
      dimensions.forEach(function(d, i) {
        d.categories.forEach(function(c) {
          c.dimension = d;
          c.count = 0;
          c.nodes = [];
        });
        d.y = y0 + i * dy;
      });

      // Compute per-category counts.
      var total = (function rollup(d, i) {
        if (!d.children) return d.count;
        var dim = dimensions[i],
            total = 0;
        dim.categories.forEach(function(c) {
          var child = d.children[c.name];
          if (!child) return;
          c.nodes.push(child);
          var count = rollup(child, i + 1);
          c.count += count;
          total += count;
        });
        return total;
      })(tree, 0);

      // Stack the counts.
      dimensions.forEach(function(d) {
        d.categories = d.categories.filter(function(d) { return d.count; });
        var x = 0,
            p = spacing / (d.categories.length - 1);
        d.categories.forEach(function(c) {
          //modif' emplacement axes plus centrés
          if (d.categories.length > 1){
            c.x = x;
          }
          else {
            c.x = (width*1/2)-(c.count / total * (width - spacing))/2;
          }
          c.dx = c.count / total * (width - spacing);
          c.in = {dx: 0};
          c.out = {dx: 0};
          x += c.dx + p;
        });
      });
      function getallComb(dimensions){ // Calculates all the combinations between a dimension "i" and the previous "i-1" dimension.
        let comb=[];
        for (let i=0; i<dimensions.length - 1; i++){
          let source=dimensions[i].categories;
          let target=dimensions[i+1].categories;
          for (let j=0; j<source.length; j++){
            var temp=[];
            for (let k=0; k<target.length; k++){
              temp.push([source[j].name, target[k].name]);
            }
            comb.push({dimension: dimensions[i+1].name, comb: temp});
          }

        }
        return comb;
      }
      var dim = dimensions[0];
      dim.categories.forEach(function(c) {
        var k = c.name;
        if (tree.children.hasOwnProperty(k)) {
          recurse(c, {node: tree.children[k], path: k}, 1, ordinal(k));
        }
      });

      function recurse(p, d, depth, major) {

        var node = d.node,
            dimension = dimensions[depth];
          dimension.categories.forEach(function(c) {
          var k = c.name;
          if (!node.children.hasOwnProperty(k)) return;
          var child = node.children[k];
          child.path = d.path + "\0" + k;
          var target = child.target || {node: c, dimension: dimension};
          target.x = c.in.dx;
          target.dx = child.count / total * (width - spacing);
          c.in.dx += target.dx;
          var source = child.source || {node: p, dimension: dimensions[depth - 1]};
          source.x = p.out.dx;
          source.dx = target.dx;
          p.out.dx += source.dx;

          child.node = child;
          child.source = source;
          child.target = target;
          child.major = major;
          nodes.push(child);
          if (depth + 1 < dimensions.length) recurse(c, child, depth + 1, major);
        });
      }
      var nouv_noeuds= recomputeNodes(nodes,getallComb(dimensions),dimensions.map(dimensionName));
      nouv_noeuds=getPaths(nouv_noeuds,dimensions);
      return nouv_noeuds;
      function recomputeNodes(nodes,combi,dimension_names){ // Calculates the final nodes from the intermiediate list of nodes obtained in "recurse"
        var new_array=[];

        dimension_names.shift();
        dimension_names.forEach(function(dim){
          let list_nod=nodes.filter(function(nod){return nod.dimension==dim});
          let list_comb=combi.filter(function(c){return c.dimension==dim});
          list_comb.forEach(function(comb){ // Get one node at the end
            comb.comb.forEach(function(c){
              var new_nod={};
              new_nod.count=0;
              var total=0;
              list_nod.forEach(function(nod){
                let path=nod.path.split('\u0000');

                if (path[path.length - 2]==c[0] && path[path.length - 1]==c[1]){
                  new_nod.count+=nod.count;
                  new_nod.dimension=dim;
                  new_nod.name=nod.name;
                  new_nod.path= path[path.length - 2]+"\u0000"+path[path.length - 1];

                }
                new_nod.major=nod.major;
                new_nod.node=new_nod;
              });
            total=list_nod.filter(function(n){return n.name==c[1];}).reduce(function(prev,cur){
              return prev+cur.count;
            });
            new_array.push(new_nod);
            });

          });
          var count=0;
          let nodos=new_array.filter(function(n){return n.dimension==dim}).sort(function(a,b){return parseInt(a.name) > parseInt(b.name)});
          let cat="";
          nodos.forEach(function(n){
            if (cat!=n.name) ++count;
            cat=n.name;
            n.major=count;
          });
        })

        return new_array.filter(function(node){return node.count>0;});
      }
      function getPaths(nodes,dimensions){ // Recomputes the x and y-coordinates of the ribbons.
        for (let j=0; j<dimensions[0].categories.length; j++){
          dimensions[0].categories[j].in.dx=0;
          dimensions[0].categories[j].out.dx=0;
        }
        for (let i=1; i<dimensions.length; i++){

          let list_nod=nodes.filter(function(n){return n.dimension==dimensions[i].name;});
          dimensions[i].categories.forEach(function(cat){
            cat.in.dx=0;
            cat.out.dx=0;
            let noeuds=list_nod.filter(function(n){return n.name==cat.name;});
            noeuds.forEach(function(noeud){
              let target={node: cat, dimension: dimensions[i]};
              target.x=cat.in.dx;
              target.dx=noeud.count / total*(width-spacing);
              cat.in.dx+=target.dx;
              let prev=noeud.path.split('\u0000');
              prev=prev[0];
              let cate=dimensions[i-1].categories.filter(function(cat){return cat.name==prev});
              cate=cate[0];
              let source={node: cate, dimension: dimensions[i-1]};
              source.x=cate.out.dx;
              cate.out.dx+=target.dx;
              source.dx=target.dx;
              noeud.source=source;
              noeud.target=target;

            })


          })
        }
        return nodes;
      }

    }

    // Dynamic path string for transitions.
    function ribbonPath(d) {
      var s = d.source,
          t = d.target;
      return ribbonPathString((s.node.x + s.x)+s.dx/4, s.dimension.y, s.dx/2, t.node.x + t.x+t.dx/4, t.dimension.y, t.dx/2, tension);
    }

    // Static path string for mouse handlers.
    function ribbonPathStatic(d) {
      var s = d.source,
          t = d.target;
      return ribbonPathString(s.node.x + s.x, s.dimension.y, s.dx/2, t.node.x + t.x, t.dimension.y, t.dx/2, tension);
    }

    function ribbonPathString(sx, sy, sdx, tx, ty, tdx, tension) {
      var m0, m1;
      return (tension === 1 ? [
          "M", [sx, sy],
          "L", [tx, ty],
          "h", tdx,
          "L", [sx + sdx, sy],
          "Z"]
       : ["M", [sx, sy],
          "C", [sx, m0 = (tension * sy + (1 - tension) * ty)], " ",
               [tx, m1 = (tension * ty + (1 - tension) * sy)], " ", [tx, ty],
          "h", tdx,
          "C", [tx + tdx, m1], " ", [sx + sdx, m0], " ", [sx + sdx, sy],
          "Z"]).join("");
    }

    function compareY(a, b) {
      a = height * a.y, b = height * b.y;
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : a <= a ? -1 : b <= b ? 1 : NaN;
    }
  };
  d3.parsets.tree = buildTree;

  function autoDimensions(d) {
    return d.length ? d3.keys(d[0]).sort() : [];
  }

  function cancelEvent() {
    d3.event.stopPropagation();
    d3.event.preventDefault();
  }

  function dimensionName(d) { return d.name; }

  function getTotal(dimensions) {
    return dimensions[0].categories.reduce(function(a, d) {
      return a + d.count;
    }, 0);
  }

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

  var percent = d3.format("%"),
      comma = d3.format(",f"),
      parsetsEase = "elastic",
      parsetsId = 0;

  // Construct tree of all category counts for a given ordered list of
  // dimensions.  Similar to d3.nest, except we also set the parent.
  function buildTree(root, data, dimensions, value) {
    zeroCounts(root);
    var n = data.length,
        nd = dimensions.length;
    for (var i = 0; i < n; i++) {
      var d = data[i],
          v = +value(d, i),
          node = root;
      for (var j = 0; j < nd; j++) {
        var dimension = dimensions[j],
            category = d[dimension],
            children = node.children;
        node.count += v;
        node = children.hasOwnProperty(category) ? children[category]
            : children[category] = {
              children: j === nd - 1 ? null : {},
              count: 0,
              parent: node,
              dimension: dimension,
              name: category
            };
      }
      node.count += v;
    }
    return root;
  }

  function zeroCounts(d) {
    d.count = 0;
    if (d.children) {
      for (var k in d.children) zeroCounts(d.children[k]);
    }
  }

  function identity(d) { return d; }

  function translateY(d) { return "translate(0," + d.y + ")"; }

  function defaultTooltip(d,total) {
    var count = d.count,
        path = [];
    return path.join(" → ") + "<br>" + comma(count) + " (" + percent(count / total) + ")" + "<br>" + d.source.node.name + "->" + d.name + "<br>" + d.parent[0].dimension + "->" + d.dimension;
  }

  function defaultCategoryTooltip(d) {
    return d.name + "<br>" + comma(d.count) + " (" + percent(d.count / d.dimension.count) + ")";
  }
})();

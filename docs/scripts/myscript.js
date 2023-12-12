// add your JavaScript/D3 to this file
  const w = 1100;
  const h = 800;
  const margin = {top: 80, right: 25, bottom: 200,
      left: 75};
  const innerWidth = w - margin.left - margin.right;
  const innerHeight = h - margin.top - margin.bottom;

  const svg = d3.select("div")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "lightgrey");


  // Add title
  svg.append("text")
      .attr("x", 250)
      .attr("y", 50)
      .attr("font-weight", "bold")
      .style("font-size", "25px")
      .text("China Faces More Environmental Challenges Than India in 2022")


  // Add Xlabel and ylabel
  svg.append("text")
      .attr("x", 550)
      .attr("y", 770)
      .attr("font-weight", "bold")
      .style("font-size", "20px")
      .text("Environmental Variables")
  svg.append("text")
      .attr("x", -90)
      .attr("y", 270)
      .text("Percentage (%)")
      .attr("dy", "0.35em")
      .attr("font-weight", "bold")
      .style("font-size", "20px")
      .attr("transform", "rotate(-90, 10, 250)");


  // manually create a legend
  svg.append("text")
      .attr("x", 1225)
      .attr("y", 29)
      .attr("font-weight", "bold")
      .text("China")
  svg.append("text")
      .attr("x", 1230)
      .attr("y", 49)
      .attr("font-weight", "bold")
      .text("India")
  svg.append("rect")
      .attr("x", 1270)
      .attr("y", 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "red");
  svg.append("rect")
      .attr("x", 1270)
      .attr("y", 40)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "green");



  // 2021 variables in %:

  const initialbardata = [30.7, 7.6];
  //const indiabardata = [7.6, 5.4, 24.4, 45, 99.6, 52];

  const bardata = [30.7, 7.6,   4.9, 5.4,    23.6, 24.4,    20,45,    100,99.6,    67,52]

  const xScale = d3.scaleBand()
      .domain(d3.range(initialbardata.length))
      .range([0, innerWidth])
      .paddingInner(.1);

  const yScale = d3.scaleLinear()
      .domain([0, 100])  // use fixed y-scale if possible
      .range([innerHeight, 0])

  const xAxis = d3.axisBottom(xScale)
    .tickFormat((d, i) => {const customTickNames = ["Global CO2 Emission contribution","Global CO2 Emission contribution", "Electricity production from renewable sources", "Electricity production from renewable sources", "Forest area","Forest area", "Annual freshwater withdrawals","Annual freshwater withdrawals", "Population Access to Electricity","Population Access to Electricity", "Sanitation Services Accessibility /Usage","Sanitation Services Accessibility /Usage"];
            return customTickNames[i];
    });

  const yAxis = d3.axisLeft()
      .scale(yScale);

  const bars = svg.append("g")
      .attr("id", "plot")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .selectAll("rect")
      .data(initialbardata);



  bars.enter().append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d))
      .attr("fill", (d,i) => i === 0 ? "red" : "green")
      .on("mouseover", function (event, d) {
        const bartooltip = svg.append("text")
          .attr("id", "bartooltip")
          .attr("x", +d3.select(this).attr("x") + xScale.bandwidth() / 1.5)
          .attr("y", +d3.select(this).attr("y") + 45)
          .text(d)
          .attr("text-anchor", "middle");
      })
      .on("mouseout", function () {
        svg.select("#bartooltip").remove();
      });



  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
      .call(xAxis)
      .selectAll(".tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
      .call(yAxis);




// General Update Pattern
  function updatechina(data) {

    xScale.domain(d3.range(data.length));

    const bars = svg.select("#plot")
        .selectAll("rect")
        .data(data);

    const paddingpix = xScale.padding()*xScale.bandwidth()/(1 - xScale.padding())


    bars.enter().append("rect")
        .attr("x", innerWidth + paddingpix)  // new bar on the right
        .attr("y", d => -10000)
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", "red")
      .merge(bars)
      .transition()  // all bars more into place
      .duration(1000)
      .ease(d3.easeLinear)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
      .transition()
      .duration(1000)
      .ease(d3.easeLinear);

    bars.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .ease(d3.easeLinear)
      .attr("x", innerWidth + paddingpix)
      .remove();

    svg.select(".xAxis")
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .call(xAxis)
       .selectAll(".tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

     svg.selectAll("rect")
        .on("mouseover", function(event, d) {
            const bartooltip = svg.append("text")
                .attr("id", "bartooltip")
                .attr("x", +d3.select(this).attr("x") + xScale.bandwidth() / 0.9)
                .attr("y", +d3.select(this).attr("y") + 70)
                .text(d)
                .attr("text-anchor", "middle");
        })
        .on("mouseout", function() {
            svg.select("#bartooltip").remove();
        });
  }

  function updateindia(data) {

    xScale.domain(d3.range(data.length));

    const bars = svg.select("#plot")
        .selectAll("rect")
        .data(data);

    const paddingpix = xScale.padding()*xScale.bandwidth()/(1 - xScale.padding())

    bars.enter().append("rect")
        .attr("x", innerWidth + paddingpix)  // new bar on the right
        .attr("y", d => -10000)
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
        .attr("fill", "green")
      .merge(bars)
      .transition()  // all bars more into place
      .duration(1000)
      .ease(d3.easeLinear)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d))
      .transition()
      .duration(1000)
      .ease(d3.easeLinear);

    bars.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .ease(d3.easeLinear)
      .attr("x", innerWidth + paddingpix)
      .remove();


    svg.select(".xAxis")
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .call(xAxis)
      .selectAll(".tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

     svg.selectAll("rect")
        .on("mouseover", function(event, d) {
            const bartooltip = svg.append("text")
                .attr("id", "bartooltip")
                .attr("x", +d3.select(this).attr("x") + xScale.bandwidth()/0.9)
                .attr("y", +d3.select(this).attr("y") + 70)
                .text(d)
                .attr("text-anchor", "middle");
        })
        .on("mouseout", function() {
            svg.select("#bartooltip").remove();
        });
  }


    function add() {
      if (initialbardata.length > 11) {
        return
      }
      let complements = bardata.filter(x => !initialbardata.includes(x));
      const result = complements.slice(0, 2);
      initialbardata.push(result[0]);
      updatechina(initialbardata);
      initialbardata.push(result[1]);
      updateindia(initialbardata);
    }

    function remove() {
      initialbardata.pop();
      updatechina(initialbardata);
      initialbardata.pop();
      updateindia(initialbardata);
      };

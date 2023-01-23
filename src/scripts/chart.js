const renderChart = (stateName, grossIncome, federalTax, socialSecurityTax, medicareTax, stateTax, federalTaxRate, stateTaxRate) => {

    const data = {}

    // Check if there is tax exists
    const checkFederalTax = function(federalTax) {
        if (federalTax > 0) return data["Federal Tax"] = federalTax;
    }
    const checkSocialSecurityTax = function(socialSecurityTax) {
        if (socialSecurityTax > 0) return data["Social Security Tax"] = socialSecurityTax
    }
    const checkMedicareTax = function(medicareTax) {
        if (medicareTax > 0) return data["Medicare Tax"] = medicareTax;
    }
    const checkStateIncomeTax = function(stateTax) {
        if (stateTax > 0) return data["State Tax"] = stateTax;
    }

    checkFederalTax(federalTax);
    checkSocialSecurityTax(socialSecurityTax);
    checkMedicareTax(medicareTax)
    checkStateIncomeTax(stateTax);

    // Calculate total tax owed for percentage calculations

    const totalTaxOwed = function(federalTax, socialSecurityTax, medicareTax, stateTax) {
        return federalTax + socialSecurityTax + medicareTax + stateTax;
    }

    const categories = [
        `Gross Income`,
        `Federal Tax (${federalTaxRate}%)`,
        `Social Security Tax`,
        `Medicare Tax`,
        `FICA Tax`,
        `State Tax (${stateTaxRate}%)`,
        `Net Income`,
        "<br>",
        `Estimated Tax Owed`
    ]

    const values = [
        `$${Number(grossIncome).toLocaleString("en-US")}`, 
        `$${federalTax.toLocaleString("en-US")}`, 
        `$${socialSecurityTax.toLocaleString("en-US")}`,
        `$${medicareTax.toLocaleString("en-US")}`,
        `$${(medicareTax + socialSecurityTax).toLocaleString("en-US")}`,
        `$${stateTax.toLocaleString("en-US")}`,
        `$${(Number(grossIncome) - totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax)).toLocaleString("en-US")}`,
        "<br>",
        `$${totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax).toLocaleString("en-US")}`
    ]

    d3.select(".modal-content")
    .append("div")
    .attr("id", "detailed-breakdown-container")
    .append("div")
    .attr("id", "modal-state")
    .text(`${stateName}`)

    d3.select("#detailed-breakdown-container")
    .append("div")
    .attr("id", "detailed-breakdown")
    .append("ul")
    .attr("id", "detail-categories")
    .selectAll("li")
    .data(categories)
    .enter()
    .append("li")
    .html(String);

    d3.select("#detailed-breakdown")
    .append("ul")
    .attr("id", "detail-values")
    .selectAll("li")
    .data(values)
    .enter()
    .append("li")
    .html(String);

    // const width = 450,
    // height = 450,
    // margin = 40;

    // const radius = Math.min(width, height) / 2 - margin

    // const svg = d3.select(".modal-content")
    // .append("svg")
    // .attr("id", "pieChart")
    // .attr("width", width)
    // .attr("height", height)
    // .append("g")
    // .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // const color = d3.scaleOrdinal()
    // .range(d3.schemeSet2);

    // const pie = d3.pie()
    // .value(function(d) {return d[1]})
    // const data_ready = pie(Object.entries(data))

    // const arcGenerator = d3.arc()
    // .innerRadius(0)
    // .outerRadius(radius)

    // svg
    // .selectAll('mySlices')
    // .data(data_ready)
    // .join('path')
    // .attr('d', arcGenerator)
    // .attr('fill', function(d){ return(color(d.data[0])) })
    // .attr("stroke", "black")
    // .style("stroke-width", "2px")
    // .style("opacity", 0.7)

    // svg
    // .selectAll('mySlices')
    // .data(data_ready)
    // .join('text')
    // .text(function(d){ return d.data[0] + ` ${(Number.parseFloat((d.data[1] / totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax)) * 100).toFixed(2))}%`})
    // .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
    // .style("text-anchor", "middle")
    // .style("font-size", 17)

    // set the dimensions and margins of the graph
    const width = 800,
    height = 450,
    margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select(".modal-content")
    .append("svg")
    .attr("id", "pieChart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

    // set the color scale
    const color = d3.scaleOrdinal()
    .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
    .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(d => d[1])
    const data_ready = pie(Object.entries(data))

    // The arc generator
    const arc = d3.arc()
    .innerRadius(0)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.8)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('allSlices')
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    // Add the polylines between chart and labels:
    svg
    .selectAll('allPolylines')
    .data(data_ready)
    .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
    const posA = arc.centroid(d) // line insertion in the slice
    const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
    const posC = outerArc.centroid(d); // Label position = almost the same as posB
    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.85 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC]
    })

    // Add the polylines between chart and labels:
    svg
    .selectAll('allLabels')
    .data(data_ready)
    .join('text')
    .text(d => `${d.data[0]} (${(Number.parseFloat((d.data[1] / totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax)) * 100).toFixed(0))}%)`)
    .attr('transform', function(d) {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.89 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
    })
    .style('text-anchor', function(d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
}

export default renderChart;


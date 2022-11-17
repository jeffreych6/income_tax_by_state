const renderChart = (stateName, grossIncome, federalTax, socialSecurityTax, medicareTax, stateTax) => {

    const data = {"Federal Tax": federalTax, "Social Security Tax": socialSecurityTax, "Medicare Tax": medicareTax}

    // Check if there is state tax

    const checkStateIncomeTax = function(stateTax) {
        if (stateTax > 0) return data["State Tax"] = stateTax;
    }

    checkStateIncomeTax(stateTax);

    // Calculate total tax owed for percentage calculations

    const totalTaxOwed = function(federalTax, socialSecurityTax, medicareTax, stateTax) {
        return federalTax + socialSecurityTax + medicareTax + stateTax;
    }

    const rows = [
    `Gross Income.........................$${Number(grossIncome).toLocaleString("en-US")}`, 
    `Federal Tax.............................$${federalTax.toLocaleString("en-US")}`, 
    `Social Security Tax....$${socialSecurityTax.toLocaleString("en-US")}`,
    `Medicare Tax.............$${medicareTax.toLocaleString("en-US")}`,
    `FICA Tax.................................$${(medicareTax + socialSecurityTax).toLocaleString("en-US")}`,
    `State Tax.................................$${stateTax.toLocaleString("en-US")}`,
    `Net Income.............................$${(Number(grossIncome) - totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax)).toLocaleString("en-US")}`,
    `Tax Owed................................$${totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax).toLocaleString("en-US")}`,
    ]

    d3.select(".modal-content")
    .append("div")
    .attr("id", "detailedBreakdown")
    .append("h3")
    .text(`${stateName}`)

    d3.select("#detailedBreakdown")
    .selectAll("li")
    .data(rows)
    .enter()
    .append("li")
    .html(String);

    const width = 450,
    height = 450,
    margin = 40;

    const radius = Math.min(width, height) / 2 - margin

    const svg = d3.select(".modal-content")
    .append("svg")
    .attr("id", "pieChart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
    .range(d3.schemeSet2);

    const pie = d3.pie()
    .value(function(d) {return d[1]})
    const data_ready = pie(Object.entries(data))

    const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    svg
    .selectAll('mySlices')
    .data(data_ready)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    svg
    .selectAll('mySlices')
    .data(data_ready)
    .join('text')
    .text(function(d){ return d.data[0] +`${(Number.parseFloat((d.data[1] / totalTaxOwed(federalTax, socialSecurityTax, medicareTax, stateTax)) * 100).toFixed(2))}%`})
    .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
    .style("text-anchor", "middle")
    .style("font-size", 17)
}

export default renderChart;


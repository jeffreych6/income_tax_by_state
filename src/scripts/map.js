import usStatesMap from "../../data/states_10m.json";
import renderChart from "./chart";
import State from "./example";

const renderMap = () => {

    const height = 500;
    const width = 900;

    // Create tooltip box
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("font-family", "arial")
        .style("padding-right", "35px")
        .style("opacity", 0.9)
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("border-radius", "10px")
        .style("width", "auto")
        .style("color", "black")
        .style("position", "absolute")
        .style("z-index", 3);

    const svg = d3.select("#map")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("class", "us-map")

    const projection = d3.geoAlbersUsa()
        // .translate([ width / 2, height / 2 ])
        .scale(1000)

    const path = d3.geoPath()
        .projection(projection)

    const states = topojson.feature(usStatesMap, usStatesMap.objects.states).features;

    svg.selectAll(".path")
        .data(states)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .on("mouseover", function(d) {
            // Hover color
            d3.select(this).classed("selected", true);

            // Hover tooltip box
            d3.select("#tooltip")
            .style("opacity", 0.9);

            // Create state object
            const filingStatus = d3.select("input[name='filingStatus']:checked").node().value
            const employmentStatus = d3.select("input[name='employmentStatus']:checked").node().value
            const currentState = new State(d, filingStatus, employmentStatus);
            
            // Get income data
            const grossIncome = Number(d3.select("#gross-income").html());

            const tooltipRows = [
                `State Tax Rate: ${Number.parseFloat(currentState.calculateStateMarginalTaxRate(currentState.name, grossIncome, filingStatus)).toFixed(2)}%`,
                "<br>", 
                `Gross Income: $${grossIncome.toLocaleString("en-US")}`,
                `Tax Owed: $${Math.floor(currentState.calculateFederalTax(grossIncome, filingStatus) 
                    + currentState.calculateSocialSecurityTax(grossIncome, employmentStatus) 
                    + currentState.calculateMedicareTax(grossIncome, employmentStatus) 
                    + currentState.calculateStateTax(currentState.name, grossIncome, filingStatus)).toLocaleString("en-US")}`,
                `Net Income: $${Math.floor(grossIncome 
                    - (currentState.calculateFederalTax(grossIncome, filingStatus) 
                    + currentState.calculateSocialSecurityTax(grossIncome, employmentStatus) 
                    + currentState.calculateMedicareTax(grossIncome, employmentStatus) 
                    + currentState.calculateStateTax(currentState.name, grossIncome, filingStatus))).toLocaleString("en-US")}`,
            ]

            // Display calculated information in hover tooltip box
            d3.select("#hoverBoxContainer").remove()
            d3.select("#hoverBoxName").remove()

            d3.select("#tooltip")
            .append("div")
            .attr("id", "hoverBoxName")
            .style("font-weight", "bold")
            .style("padding-top", "20px")
            .text(`${(currentState.titleize(currentState.name))}`)

            d3.select("#tooltip")
            .append("ul")
            .attr("id", "hoverBoxContainer")
            .selectAll("li")
            .data(tooltipRows)
            .enter()
            .append("li")
            .html(String);
        })
        .on("mouseout", function(d) {
            d3.select(this).classed("selected", false);
            d3.select("#tooltip").style("opacity", 0)
        })
        .on("mousemove", function(d) {
            d3.select("#tooltip")
            .style("left", `${d3.pointer(d)[0] + 150}px`)
            .style("top", `${d3.pointer(d)[1] - 50}px`)
        })
        .on("click", function(d) {
            // Reset modal
            d3.select("#pieChart").remove()
            d3.select("#detailedBreakdown").remove()
            d3.select("#instructions").remove()

            // Create state object
            const filingStatus = d3.select("input[name='filingStatus']:checked").node().value
            const employmentStatus = d3.select("input[name='employmentStatus']:checked").node().value
            const currentState = new State(d, filingStatus, employmentStatus)

            // Get income data
            const grossIncome = d3.select("#gross-income").html();

            // Calculate numbers
            const federalTax = Math.floor(currentState.calculateFederalTax(grossIncome, filingStatus))
            const socialSecurityTax = Math.floor(currentState.calculateSocialSecurityTax(grossIncome, employmentStatus))
            const medicareTax = Math.floor(currentState.calculateMedicareTax(grossIncome, employmentStatus))
            const stateTax = Math.floor(currentState.calculateStateTax(currentState.name, grossIncome, filingStatus))
            const federalTaxRate = Number.parseFloat(currentState.calculateFederalMarginalTaxRate(grossIncome, filingStatus)).toFixed(2)
            const stateTaxRate = Number.parseFloat(currentState.calculateStateMarginalTaxRate(currentState.name, grossIncome, filingStatus)).toFixed(2)

            // Display modal
            document.getElementById("myModal").style.display = "block"

            renderChart(currentState.titleize(currentState.name), grossIncome, federalTax, socialSecurityTax, medicareTax, stateTax, federalTaxRate, stateTaxRate);
        })
}

export default renderMap;
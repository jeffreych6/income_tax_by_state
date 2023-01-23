import usStatesMap from "../../data/states_10m.json";
import renderChart from "./chart";
import State from "./calculations";

const renderMap = () => {

    const height = 500;
    const width = 900;

    // Create a hover box
    d3.select("body")
        .append("div")
        .attr("id", "hoverBox")
        .style("display", "none");

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

            // Hover hoverbox box
            d3.select("#hoverBox")
            .style("display", "block");

            // Create state object
            const filingStatus = d3.select("input[name='filingStatus']:checked").node().value
            const employmentStatus = d3.select("input[name='employmentStatus']:checked").node().value
            const currentState = new State(d, filingStatus, employmentStatus);
            
            // Get income data
            const grossIncome = Number(d3.select("#gross-income").html());

            const hoverBoxRows = [
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

            // Display calculated information in hover hoverbox box
            d3.select("#hoverBoxContainer").remove()
            d3.select("#hoverBoxName").remove()
            d3.select("#hoverBoxDetails").remove()

            d3.select("#hoverBox")
            .append("div")
            .attr("id", "hoverBoxContainer")

            d3.select("#hoverBoxContainer")
            .append("div")
            .attr("id", "hoverBoxStateName")
            .text(`${(currentState.titleize(currentState.name))}`)

            d3.select("#hoverBoxContainer")
            .append("ul")
            .attr("id", "hoverBoxDetails")
            .selectAll("li")
            .data(hoverBoxRows)
            .enter()
            .append("li")
            .html(String);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).classed("selected", false);
            d3.select("#hoverBox").style("display", "none")
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY + 15}px`);
        })
        .on("mousemove", function(event, d) {
            d3.select("#hoverBox")
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY + 15}px`);

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
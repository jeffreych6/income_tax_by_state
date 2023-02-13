import usStatesMap from "../../data/states_10m.json";
import renderChart from "./chart";
import State from "./calculations";

const renderMap = () => {

    const height = 500;
    const width = 900;

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
            d3.select(this).classed("selected", true);

            d3.select("#hoverBox")
            .style("display", "block");

            const filingStatus = d3.select("input[name='filingStatus']:checked").node().value
            const employmentStatus = d3.select("input[name='employmentStatus']:checked").node().value
            const currentState = new State(d, filingStatus, employmentStatus);
            
            const grossIncome = Number(d3.select("#gross-income").html());

            const hoverBoxRows = [
                `State Tax Rate: ${Number.parseFloat(currentState.calculateStateMarginalTaxRate(currentState.name, grossIncome, filingStatus)).toFixed(2)}%`,
                "<br>", 
                `Gross Income: $${grossIncome.toLocaleString("en-US")}`,
                `Net Income: $${Math.floor(grossIncome 
                    - (currentState.calculateFederalTax(grossIncome, filingStatus) 
                    + currentState.calculateSocialSecurityTax(grossIncome, employmentStatus) 
                    + currentState.calculateMedicareTax(grossIncome, employmentStatus) 
                    + currentState.calculateStateTax(currentState.name, grossIncome, filingStatus))).toLocaleString("en-US")}`,
                `Estimated Tax Owed: $${Math.floor(currentState.calculateFederalTax(grossIncome, filingStatus) 
                    + currentState.calculateSocialSecurityTax(grossIncome, employmentStatus) 
                    + currentState.calculateMedicareTax(grossIncome, employmentStatus) 
                    + currentState.calculateStateTax(currentState.name, grossIncome, filingStatus)).toLocaleString("en-US")}`
            ]

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
            d3.select("#pieChart").remove()
            d3.select("#detailed-breakdown-container").remove()
            d3.select("#instructions").remove()

            const filingStatus = d3.select("input[name='filingStatus']:checked").node().value
            const employmentStatus = d3.select("input[name='employmentStatus']:checked").node().value
            const currentState = new State(d, filingStatus, employmentStatus)

            const grossIncome = d3.select("#gross-income").html();

            const federalTax = Math.floor(currentState.calculateFederalTax(grossIncome, filingStatus))
            const socialSecurityTax = Math.floor(currentState.calculateSocialSecurityTax(grossIncome, employmentStatus))
            const medicareTax = Math.floor(currentState.calculateMedicareTax(grossIncome, employmentStatus))
            const stateTax = Math.floor(currentState.calculateStateTax(currentState.name, grossIncome, filingStatus))
            const federalTaxRate = Number.parseFloat(currentState.calculateFederalMarginalTaxRate(grossIncome, filingStatus)).toFixed(2)
            const stateTaxRate = Number.parseFloat(currentState.calculateStateMarginalTaxRate(currentState.name, grossIncome, filingStatus)).toFixed(2)

            document.getElementById("myModal").style.display = "block"

            renderChart(currentState.titleize(currentState.name), grossIncome, federalTax, socialSecurityTax, medicareTax, stateTax, federalTaxRate, stateTaxRate);
        })
}

export default renderMap;
import usStatesMap from "../../states_10m.json";
import renderChart from "./chart";
import State from "./example";

const renderMap = () => {

    const height = 600;
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

            console.log(d)
            // Create state object
            const currentState = new State(d)

            // Get income data
            const grossIncome = Number(d3.select("#gross-income").html());
            

            const tooltipRows = [
                // `${(currentState.titleize(currentState.name))}`,
                `Gross Income: $${grossIncome.toLocaleString("en-US")}`, 
                `Tax Owed: $${Math.floor(currentState.calculateFederalTax(grossIncome) + currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome) + currentState.calculateStateTax(currentState.name, grossIncome)).toLocaleString("en-US")}`,
                `Net Income: $${Math.floor(grossIncome - (currentState.calculateFederalTax(grossIncome) + currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome) + currentState.calculateStateTax(currentState.name, grossIncome))).toLocaleString("en-US")}`,
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

            // d3.select("#tooltip")
            // .append("div")
            // .attr("id", "hoverBoxContainer")
            // .append("div")
            // .text(`${currentState.titleize(currentState.name)}`)
            // .style("font-weight", "bold")
            // .append("div")
            // .text(`Gross Income: $${grossIncome.toLocaleString("en-US")}`)
            // .append("div")
            // .text(`Standard Deduction: $${currentState.calculateStandardDeduction().toLocaleString("en-US")}`)
            // .append("div")
            // .text(`Federal Income Tax: $${Math.floor(currentState.calculateFederalTax(grossIncome)).toLocaleString("en-US")}`)
            // .append("div")
            // .text(`FICA Tax: $${Math.floor(currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome)).toLocaleString("en-US")}`) 
            // .append("div")
            // .text(`State Tax: $${Math.floor(currentState.calculateStateTax(currentState.name, grossIncome)).toLocaleString("en-US")}`)
            // .append("div")
            // .text(`State Standard Deduction: $${currentState.calculateStateStandardDeduction(currentState.name).toLocaleString("en-US")}`)
            // .append("div")
            // .text(`Tax Owed: $${Math.floor(currentState.calculateFederalTax(grossIncome) + currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome) + currentState.calculateStateTax(currentState.name, grossIncome)).toLocaleString("en-US")}`)
            // .append("div")
            // .text(`Net Income: $${Math.floor(grossIncome - currentState.calculateFederalTax(grossIncome) - currentState.calculateSocialSecurityTax(grossIncome) - currentState.calculateMedicareTax(grossIncome) - currentState.calculateStateTax(currentState.name, grossIncome)).toLocaleString("en-US")}`)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed("selected", false);
            d3.select("#tooltip").style("opacity", 0)
        })
        .on("mousemove", function(d) {
            d3.select("#tooltip")
            .style("left", `${d3.pointer(d)[0]}px`)
            .style("top", `${d3.pointer(d)[1]}px`)
        })
        .on("click", function(d) {
            // Reset chart
            d3.select("#pieChart").remove()
            d3.select("#detailedBreakdown").remove()
            d3.select("#instructions").remove()
            // Create state object
            const currentState = new State(d)
            // Get income data
            const grossIncome = d3.select("#gross-income").html();
            // Calculate numbers
            const federalTax = Math.floor(currentState.calculateFederalTax(grossIncome))
            const socialSecurityTax = Math.floor(currentState.calculateSocialSecurityTax(grossIncome))
            const medicareTax = Math.floor(currentState.calculateMedicareTax(grossIncome))
            const stateTax = Math.floor(currentState.calculateStateTax(currentState.name, grossIncome))

            document.getElementById("myModal").style.display = "block"

            renderChart(currentState.titleize(currentState.name), grossIncome, federalTax, socialSecurityTax, medicareTax, stateTax);

        })
}

export default renderMap;

// hover should show: state name, gross income, marginal tax rate, tax owed, net income
// how to get my state data to each state on hover??

// can i create an object for each state on map render?? do i need this if i want to color code map??
// or should i create the object on event (mouseover/click)?
// also grab income data from slider
// should i edit my topo/state json files so that my state names match?? new_york vs New York *** this would make things easier i think

// detailed break down includes: gross income, federal tax, fica tax, state tax, tax owed, net income

// color code based on marginal tax rate from income

// maybe
// if match state name with topo properties name, can create titletize function when displaying state name

// function to render
// separate function to iterate through all nodes to create an new object
// each tick of income slider will call function to craate new object for each state
// color code depending on marginal tax rate with css
// change the state names in topo json
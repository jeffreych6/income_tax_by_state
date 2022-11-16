import usStatesMap from "../../states_10m.json";
import State from "./example";

const renderMap = () => {

    const height = 600;
    const width = 900;

    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("text-align", "left")
        .style("padding", "16px")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("width", "auto")
        .style("opacity", 0)
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
    console.log(states)
    

    svg.selectAll(".path")
        .data(states)
        .enter()
        .append("path")
        // .attr("id", function (d) {
        //     return `${d.properties.name}`
        // })
        .attr("class", "state")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed("selected", true);

            const tooltipBox = document.getElementById("tooltip");
            tooltipBox.style.top = `${d3.mouse(this)[0]}px`;
            tooltipBox.style.left = `${d3.mouse(this)[1]}px`;
            tooltipBox.style.opacity = 0.9;

            const currentState = new State(d)
            console.log(currentState.calculateTax(d.properties.name))
            console.log(currentState.name)
            // State.hoverCalculations(d.properties.name);

            const grossIncome = 1000000;

            d3.select("#hoverBoxContainer").remove()
            d3.select("#tooltip")
            .append("div")
            .attr("id", "hoverBoxContainer")
            .append("div")
            .text(`${currentState.titleize(d.properties.name)}`)
            .style("font-weight", "bold")
            .append("div")
            .text(`Gross Income: $1000000`)
            .append("div")
            .text(`Federal Income Tax: $${Math.floor(currentState.calculateFederalTax(grossIncome))}`)
            .append("div")
            .text(`FICA Tax: $${Math.floor(currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome))}`) 
            .append("div")
            .text(`State Tax: $${Math.floor(currentState.calculateStateTax(d.properties.name, grossIncome))}`)
            .append("div")
            .text(`Tax Owed: $${Math.floor(currentState.calculateFederalTax(grossIncome) + currentState.calculateSocialSecurityTax(grossIncome) + currentState.calculateMedicareTax(grossIncome) + currentState.calculateStateTax(d.properties.name, grossIncome))}`)
            .append("div")
            .text(`Net Income: $${Math.floor(grossIncome - currentState.calculateFederalTax(grossIncome) - currentState.calculateSocialSecurityTax(grossIncome) - currentState.calculateMedicareTax(grossIncome) - currentState.calculateStateTax(d.properties.name, grossIncome))}`)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed("selected", false);
            d3.select("#tooltip").style("opacity", 0)
        })
        .on("mousemove", function(d) {
            d3.select("#tooltip")
              .style("left", `${d3.mouse(this)[0] + 10}px`)
              .style("top", `${d3.mouse(this)[1] + 10}px`);
        })

    

        // create div
        // mouseover, mousemove, mouseout, click
}

// export {renderMap, render};
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
import usStatesMap from "../../states_10m.json";
import State from "./example";

const renderMap = () => {

    const height = 600;
    const width = 900;

    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("text-align", "left")
        .style("padding", `${16}px`)
        .style("background-color", "lightsalmon")
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
        .attr("id", function (d) {
            return `${d.properties.name}`
        })
        .attr("class", "state")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed("selected", true);
            const hoverBox = document.getElementById("tooltip");
            hoverBox.style.top = `${d3.mouse(this)[0] + 10}px`;
            hoverBox.style.left = `${d3.mouse(this)[1] + 10}px`;
            hoverBox.style.opacity = 0.92;
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
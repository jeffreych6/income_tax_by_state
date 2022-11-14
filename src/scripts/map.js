import usStatesMap from "../../states_10m.json";

const renderMap = fullDataset => {

    const width = 900;
    const height = 600;

    const svg = d3.select("#map")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("class", "us-map")

    const projection = d3.geoAlbersUsa()
        .translate([ width / 2, height / 2 ])
        .scale(800)

    const path = d3.geoPath()
        .projection(projection)

    const states = topojson.feature(usStatesMap, usStatesMap.objects.states).features
    console.log(states)

    svg.selectAll(".path")
        .data(states)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)

    // const usMap = document.getElementsByClassName("us-map")
    
    // usMap.addEventListener("mouseover", e => {
    //     const name = e.target.
    // })
}

export default renderMap;
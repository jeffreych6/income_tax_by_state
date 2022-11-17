const renderSlider = () => {

    d3.select("#slider-container")
        .append("input")
        .attr("id", "slider")
        .attr("type", "range")
        .attr("min", 1000)
        .attr("max", 500000)
        .attr("value", 100000)
        .attr("step", 1000)
        .on("input", function(e) {
            const grossIncome = this.value;
            d3.select("#gross-income")
            .html(grossIncome)
        })

    d3.select("#slider-container")
        .append("div")
        .attr("id", "gross-income")
        .html(100000)
}

export default renderSlider;
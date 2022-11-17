const renderInstructions = () => {
    d3.select("#pieChart").remove()
    d3.select("#detailedBreakdown").remove()
    d3.select("#instructions").remove()

    d3.select(".modal-content")
    .append("div")
    .attr("id", "instructions")
    .append("h3")
    .text("Income Tax Calculator")

    d3.select("#instructions")
    .append("p")
    .text("The goal of this application is to provide users a simple way of estimating their taxes for a given income.")

    d3.select("#instructions")
    .append("li")
    .text("Adjust your gross income by dragging the slider thumb on the income slider")

    d3.select("#instructions")
    .append("li")
    .text("Hover over any state to view quick tax information for that state")

    d3.select("#instructions")
    .append("li")
    .text("Click on any state to view more tax details for that state")
}

export default renderInstructions
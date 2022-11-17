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
    .text("The goal of this application is to provide users a simple way of estimating taxes for a given income, filing status, and employment status. Users may adjust their inputs by using the slider and buttons below the map. Please be aware that this app does NOT include city/county tax or other tax adjustments and only provides an ESTIMATE!")

    d3.select("#instructions")
    .append("li")
    .text("Adjust your gross income by dragging the slider thumb on the income slider")

    d3.select("#instructions")
    .append("li")
    .text("Select your filing status and employment status with the buttons")

    d3.select("#instructions")
    .append("li")
    .text("Hover over any state to view estimated tax owed and net income for that state")

    d3.select("#instructions")
    .append("li")
    .text("Click on any state to view additional tax details for that state")
}

export default renderInstructions
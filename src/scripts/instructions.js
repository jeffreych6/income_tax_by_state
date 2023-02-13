const renderInstructions = () => {
    d3.select("#pieChart").remove()
    d3.select("#detailed-breakdown-container").remove()
    d3.select("#instructions").remove()

    d3.select(".modal-content")
    .append("div")
    .attr("id", "instructions")
    .append("h1")
    .text("Income Tax Calculator")

    d3.select("#instructions")
    .append("p")
    .text("The goal of this application is to provide users a simple way of estimating taxes for a given income, filing status, and employment status. Users may adjust their inputs using the slider and buttons below the map.")

    d3.select("#instructions")
    .append("p")
    .text("NOTE: This app uses 2020 tax data and does NOT include city/county tax and several other tax adjustments. It only provides an ESTIMATE!")
    
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
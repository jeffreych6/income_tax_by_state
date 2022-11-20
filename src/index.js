import renderMap from "./scripts/map";
import renderInstructions from "./scripts/instructions";
import renderSlider from "./scripts/slider";

renderMap();
renderSlider();

document.getElementById("instruction-button").onclick = function() {
    document.getElementById("myModal").style.display = "block";
    renderInstructions();
}

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("myModal").style.display = "none";
  }
  
window.onclick = function(event) {
if (event.target == document.getElementById("myModal")) {
    document.getElementById("myModal").style.display = "none";
}
}
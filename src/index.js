import renderMap from "./scripts/map";
import renderSlider from "./scripts/slider";

renderMap();
renderSlider();

// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("myModal").style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
  }
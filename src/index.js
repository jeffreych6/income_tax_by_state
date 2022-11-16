import * as index from "../data/index.js";
import State from "./scripts/example";
// import {renderMap, render} from "./scripts/map";
import renderMap from "./scripts/map";

const states = document.getElementById("states");

// Object.keys(index.default).map((state) => {
//     let li = document.createElement('li');
//     li.innerText = state;
//     states.append(li);
//     new State(li);
// })

renderMap();
// render();   

// create object for each state, calculate taxes
// 
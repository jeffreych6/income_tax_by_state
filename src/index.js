import { Example, State } from "./scripts/example";
// import State from "./scripts/example";

import * as index from "../data/index.js";

const main = document.getElementById("main");
new Example(main);

const states = document.getElementById("states");

Object.keys(index.default).map((state) => {
    let li = document.createElement('li');
    li.innerText = state;
    states.append(li);
    new State(li);
})

// let income = 100000
// let tax_owed = 0

// index.default.new_york.single.income_tax_brackets.forEach((ele) => {
//     if (income > ele.bracket) {
//         income -= ele.bracket
//         tax_owed += ele.bracket * (ele.marginal_rate * 0.01)
//     } else if (income < ele.bracket) {
//         tax_owed += income * (ele.marginal_rate * 0.01);
//         income -= income;
//     }
//     console.log(income)
//     console.log(ele.bracket * (ele.marginal_rate * 0.01))
//     console.log(tax_owed)
// })
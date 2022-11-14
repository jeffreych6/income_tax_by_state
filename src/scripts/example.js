import * as index from "../../data/index";


class Example {
    constructor(ele){
        this.ele = ele;
        this.ele.innerHTML = "<h1>It's ALIVE!!!</h1>"

        this.ele.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(){
        this.ele.children[0].innerText = "Ouch!";
    }
}

class State {
    constructor(ele){
        this.ele = ele;
        this.name = ele.innerText
        this.ele.innerText = this.name;

        this.ele.addEventListener("mouseover", this.handleClick.bind(this));
        this.ele.addEventListener("mouseout", this.handleMouseOut.bind(this));
        // this.calculateTax = this.calculateTax.bind(this);
    }

    handleClick() {
        // console.log(calculateTax);
        this.ele.innerText = this.calculateTax(this.name);
    }

    handleMouseOut() {
        // console.log(calculateTax);
        this.ele.innerText = this.name;
    }

    calculateTax(stateName) {
        let income = 1000000 
        let tax_owed = 0

        if (!index.default[stateName].single.income_tax_brackets) return "No state income tax"

        index.default[stateName].single.income_tax_brackets.forEach((ele) => {

            if (ele.bracket === 0) {
                tax_owed += income * (ele.marginal_rate * 0.01);
                income -= tax_owed;
            } else if (income > ele.bracket) {
                income -= ele.bracket
                tax_owed += ele.bracket * (ele.marginal_rate * 0.01)
            } else if (income < ele.bracket) {
                tax_owed += income * (ele.marginal_rate * 0.01);
                income -= income;
            }

            // if at last tax bracket [taxbracket.length-1], tax the remaining income
            // don't forget standard deduction
            
            // console.log(income)
            // console.log(ele.bracket * (ele.marginal_rate * 0.01))
            // console.log(tax_owed)
        })
        return `You owe $${Math.floor(tax_owed)} and have $${Math.floor(1000000 - tax_owed)} leftover!`
    }
}

export {Example, State};

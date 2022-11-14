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

    calculateTax(stateName, calculateFederalTax, calculateSocialSecurityTax, calculateMedicareTax, calculateStateTax) {
        const grossIncome = 1000000 

        calculateFederalTax = () => {
            let standardDeduction = index.default.federal.tax_withholding_percentage_method_tables.annual.single.deductions[0].deduction_amount
            let income = grossIncome - standardDeduction
            let taxOwed = 0
            let taxBrackets = index.default.federal.tax_withholding_percentage_method_tables.annual.single.income_tax_brackets

            for (let i = 0; i < taxBrackets.length; i++) {
                if (i === taxBrackets.length - 1) {
                    taxOwed += income * (taxBrackets[i].marginal_rate * 0.01);
                    income -= income;
                    return taxOwed;
                }

                if (income > (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                    taxOwed += (taxBrackets[i + 1].bracket - taxBrackets[i].bracket) * (taxBrackets[i].marginal_rate * 0.01);
                    income -= (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)
                } else if (income < (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                    taxOwed += income * (taxBrackets[i].marginal_rate * 0.01);
                    income -= income;
                } else if (income === 0) break; 
            }

            return taxOwed;
        }

        calculateSocialSecurityTax = () => {
            const max = 8537.40;
            const socialSecurityTaxRate = 0.062;
            if (grossIncome * socialSecurityTaxRate > max) return max;
            return grossIncome * socialSecurityTaxRate;
        }

        calculateMedicareTax = () => {
            const medicareTaxRate = 0.0145;
            let taxOwed = 0;
            if (grossIncome > 200000) taxOwed += (grossIncome - 200000) * 0.009;
            taxOwed += grossIncome * medicareTaxRate;
            return taxOwed;
        }

        calculateStateTax = (stateName) => {
            if (!index.default[stateName].single.income_tax_brackets) return 0;
            let standardDeduction = index.default[stateName].single.deductions.length > 0 ? index.default[stateName].single.deductions[0].deduction_amount : 0;
            let income = grossIncome - standardDeduction
            let taxOwed = 0
            let taxBrackets = index.default[stateName].single.income_tax_brackets


            for (let i = 0; i < taxBrackets.length; i++) {
                if (i === taxBrackets.length - 1) {
                    taxOwed += income * (taxBrackets[i].marginal_rate * 0.01);
                    income -= income;
                    return taxOwed;
                }

                if (income > (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                    taxOwed += (taxBrackets[i + 1].bracket - taxBrackets[i].bracket) * (taxBrackets[i].marginal_rate * 0.01);
                    income -= (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)
                } else if (income < (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                    taxOwed += income * (taxBrackets[i].marginal_rate * 0.01);
                    income -= income;
                } else if (income === 0) break; 
            }

            return taxOwed;
        }
        return `You owe $${Math.floor(calculateFederalTax())} federal tax, $${Math.floor(calculateSocialSecurityTax() + calculateMedicareTax())} FICA tax, $${Math.floor(calculateStateTax(stateName))} ${stateName} tax and have $${Math.floor(grossIncome - calculateFederalTax() - calculateSocialSecurityTax() - calculateMedicareTax() - calculateStateTax(stateName))} leftover!`
    }
}

export {Example, State};



import * as index from "../../data/index";

class State {
    constructor(ele){
        this.name = ele.properties.name;
    }

    calculateFederalTax = (grossIncome) => {
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

    calculateSocialSecurityTax = (grossIncome) => {
        const max = 8537.40;
        const socialSecurityTaxRate = 0.062;
        if (grossIncome * socialSecurityTaxRate > max) return max;
        return grossIncome * socialSecurityTaxRate;
    }

    calculateMedicareTax = (grossIncome) => {
        const medicareTaxRate = 0.0145;
        let taxOwed = 0;
        if (grossIncome > 200000) taxOwed += (grossIncome - 200000) * 0.009;
        taxOwed += grossIncome * medicareTaxRate;
        return taxOwed;
    }

    calculateStateTax = (stateName, grossIncome) => {
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

    titleize(stateName) {
        let str = stateName.split("_")
        let capitalized = []
        for (let i = 0; i < str.length; i++) {
            capitalized.push(str[i][0].toUpperCase() + str[i].slice(1).toLowerCase());
        }
        return capitalized.join(" ")
    }

    // static hoverCalculations = (stateName) => {
    //     let grossIncome = 1000000;

    //     d3.select("#hoverBoxContainer").remove()
    //     d3.select("#tooltip")
    //     .append("div")
    //     .attr("id", "hoverBoxContainer")
    //     .append("div")
    //     .text(`${titleize(stateName)}`)
    //     .append("div")
    //     .text(`Gross Income: $1000000`)
    //     .append("div")
    //     .text(`Federal Income Tax: ${this.calculateFederalTax(grossIncome)}`)
    //     .append("div")
    //     .text("bye")
    // }

















}

export default State;



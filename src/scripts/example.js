import * as index from "../../data/index";

class State {
    constructor(ele){
        this.name = ele.target.__data__.properties.name;
    }
    
    calculateStandardDeduction = () => {
        return index.default.federal.tax_withholding_percentage_method_tables.annual.single.deductions[0].deduction_amount
    }

    calculateStateStandardDeduction = (stateName) => {
        if (!index.default[stateName].single.income_tax_brackets) return 0;
        return index.default[stateName].single.deductions.length > 0 ? index.default[stateName].single.deductions[0].deduction_amount : 0
    }

    calculateFederalTax = (grossIncome) => {
        let standardDeduction = index.default.federal.tax_withholding_percentage_method_tables.annual.single.deductions[0].deduction_amount
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
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
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
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

    titleize(stateName) {
        let str = stateName.split("_")
        let capitalized = []
        for (let i = 0; i < str.length; i++) {
            capitalized.push(str[i][0].toUpperCase() + str[i].slice(1).toLowerCase());
        }
        return capitalized.join(" ")
    }

}

export default State;

// need functions to calculate:
// overall tax rate
// state tax rate



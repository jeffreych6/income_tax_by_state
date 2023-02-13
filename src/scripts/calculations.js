import * as index from "../../data/index";

class State {
    constructor(ele, filingStatus, employmentStatus){
        this.name = ele.target.__data__.properties.name;
        this.filingStatus = filingStatus;
        this.employmentStatus = employmentStatus;
    }
    
    calculateStandardDeduction = (filingStatus) => {
        return index.default.federal.tax_withholding_percentage_method_tables.annual[filingStatus].deductions[0].deduction_amount
    }

    calculateStateStandardDeduction = (stateName, filingStatus) => {
        if (!index.default[stateName][filingStatus].income_tax_brackets) return 0;
        return index.default[stateName][filingStatus].deductions.length > 0 ? index.default[stateName][filingStatus].deductions[0].deduction_amount : 0
    }

    calculateFederalTax = (grossIncome, filingStatus) => {
        let standardDeduction = index.default.federal.tax_withholding_percentage_method_tables.annual[filingStatus].deductions[0].deduction_amount
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
        let taxOwed = 0
        let taxBrackets = index.default.federal.tax_withholding_percentage_method_tables.annual[filingStatus].income_tax_brackets

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

    calculateSocialSecurityTax = (grossIncome, employmentStatus) => {
        const employeeMax = 9555;
        const selfEmployedMax = 18228;
        const socialSecurityTaxRate = 0.062;

        if (employmentStatus === "employed") {
            if (grossIncome * socialSecurityTaxRate > employeeMax) return employeeMax;
            return grossIncome * socialSecurityTaxRate;
        } else {
            if (grossIncome * (socialSecurityTaxRate * 2) > selfEmployedMax) return selfEmployedMax;
            return grossIncome * (socialSecurityTaxRate * 2);
        }
    }

    calculateMedicareTax = (grossIncome, employmentStatus) => {
        const medicareTaxRate = 0.0145;
        let taxOwed = 0;

        if (employmentStatus === "employed") {
            if (grossIncome > 200000) taxOwed += (grossIncome - 200000) * 0.009;
            taxOwed += grossIncome * medicareTaxRate;
            return taxOwed;
        } else {
            if (grossIncome > 200000) taxOwed += (grossIncome - 200000) * 0.009;
            taxOwed += grossIncome * medicareTaxRate * 2;
            return taxOwed;
        }
    }

    calculateStateTax = (stateName, grossIncome, filingStatus) => {
        if (!index.default[stateName][filingStatus].income_tax_brackets) return 0;
        let standardDeduction = index.default[stateName][filingStatus].deductions.length > 0 ? index.default[stateName][filingStatus].deductions[0].deduction_amount : 0;
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
        let taxOwed = 0
        let taxBrackets = index.default[stateName][filingStatus].income_tax_brackets


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

    calculateFederalMarginalTaxRate = (grossIncome, filingStatus) => {
        let standardDeduction = index.default.federal.tax_withholding_percentage_method_tables.annual[filingStatus].deductions[0].deduction_amount
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
        let taxBrackets = index.default.federal.tax_withholding_percentage_method_tables.annual[filingStatus].income_tax_brackets

        for (let i = 0; i < taxBrackets.length; i++) {
            if (i === taxBrackets.length - 1) {
                return taxBrackets[i].marginal_rate;
            }

            if (income > (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                income -= (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)
            } else if (income < (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                return taxBrackets[i].marginal_rate
            }
        }
    }

    calculateStateMarginalTaxRate = (stateName, grossIncome, filingStatus) => {
        if (!index.default[stateName][filingStatus].income_tax_brackets) return 0;
        let standardDeduction = index.default[stateName][filingStatus].deductions.length > 0 ? index.default[stateName][filingStatus].deductions[0].deduction_amount : 0;
        let income = (grossIncome - standardDeduction) < 0 ? 0 : (grossIncome - standardDeduction)
        let taxBrackets = index.default[stateName][filingStatus].income_tax_brackets

        for (let i = 0; i < taxBrackets.length; i++) {
            if (i === taxBrackets.length - 1) {
                return taxBrackets[i].marginal_rate;
            }

            if (income > (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                income -= (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)
            } else if (income < (taxBrackets[i + 1].bracket - taxBrackets[i].bracket)) {
                return taxBrackets[i].marginal_rate;
            }
        }
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



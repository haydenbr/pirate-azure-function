const _ = require('lodash');

function filterAvailableProducts(products, inputs) {
	return _.filter(products, product => checkProductAgainstRules(product, inputs));
}

function checkProductAgainstRules(product, inputs) {
	return _.reduce(rules, (productIsAvailable, nextRule) => productIsAvailable && nextRule(product, inputs), true);
}

const rules = [
	noCFIExceptBasic,
	noCFIforMedicalIndustry,
	noCreditCardForOneMillionDollarsAnnualRevenue,
	noWorkPlaceBankingForRetailOrRestaurants,
];

function noCFIExceptBasic(product, inputs) {
	return !product.ExternalId.startsWith('CFI_');
}

function noCFIforMedicalIndustry(product, inputs) {
	let facts = inputs.facts;
	return !(product.ExternalId === 'CFI' && facts.businessIndustry.value === 'healthcare');
}

function noCreditCardForOneMillionDollarsAnnualRevenue(product, inputs) {
	let facts = inputs.facts;
	let annualRevenue = facts.annualRevenue;
	return !(annualRevenue >= Math.pow(10, 6) && product.Data && product.Data.category === 'Credit Card');
}

function noWorkPlaceBankingForRetailOrRestaurants(product, inputs) {
	let facts = inputs.facts;
	return !(product.ExternalId === 'WORKPLACE_BNK' && facts.businessIndustry.value === 'retail_restaurant');
}

module.exports = filterAvailableProducts;

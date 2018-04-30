const _ = require('lodash');

function trimProducts(products) {
	return _.map(products, p => {
		let product = _.pick(p, ['ProductFeatures', 'ProductId']);
		product.ProductFeatures = trimProductFeatures(product.ProductFeatures);
		return product;
	});
}

function trimProductFeatures(productFeatures) {
	return _.map(productFeatures, pf => pf.ProductFeatureId);
}

module.exports = trimProducts;

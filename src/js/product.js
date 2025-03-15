import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// Get product Id from URL
const productId = getParam('product');

// Create an instance of ProductData to fetch the data
const dataSource = new ProductData('tents');

// Create an instance of ProductDetails and start loading
const product = new ProductDetails(productId, dataSource);
product.init();


console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

let baseUrl = '';
let pathPrefix = '';

switch (process.env.NODE_ENV) {
	case "localhost":
		baseUrl = `http://localhost:8080/`;
		console.log("Using local environment settings");
		break;
	case "prod":
		baseUrl = `https://mybus.metro.net/`;
		pathPrefix = '';
		console.log("Using production environment settings");
		break;
	case "dev":
		baseUrl = `https://lacmta.github.io/`;
		pathPrefix = 'mybus-v3-dev';
		console.log("Using development environment settings");
		break;
	default:
		console.log("Using unknown settings");
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("assets/uswds");
	eleventyConfig.addPassthroughCopy("src/data");
	eleventyConfig.addPassthroughCopy("src/favicon.ico");

	// check for empty values before using this filter
	eleventyConfig.addLiquidFilter('separateByPipe', function(value) {
		let value_arr = value.split('|');
		value_arr = value_arr.filter(element => element.trim() != "NA" && element.trim() != "No Data");
		let result = '';

		if (value_arr.length > 1) {
			value_arr.forEach((val, key, arr) => {
				if (Object.is(arr.length - 1, key)) {
					result += 'or ' + val.trim();
				} else {
					result += val.trim() + ', ';
				}
			});
		} else {
			result = value_arr[0].trim();
		}

		return result;
	});

	return {
		pathPrefix: pathPrefix,
		dir: {
			input: "src",
			output: "docs",
			data: "data"
		}
	};
};
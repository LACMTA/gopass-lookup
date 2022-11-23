module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("assets/uswds");
	eleventyConfig.addPassthroughCopy("src/_data");
	eleventyConfig.addPassthroughCopy("src/favicon.ico");

	// check for empty values befor using this filter
	eleventyConfig.addLiquidFilter('separateByPipe', function(value) {
		let value_arr = value.split('|');
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
			result = value_arr[0];
		}

		return result;
	});

	return {
		pathPrefix: "/gopass-lookup/",
		dir: {
			input: "src",
			output: "docs",
			data: "_data"
		}
	};
};
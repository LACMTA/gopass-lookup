module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("assets/uswds");
	eleventyConfig.addPassthroughCopy("src/data");

	return {
		pathPrefix: "/gopass-lookup/",
		dir: {
			input: "src",
			output: "docs",
			data: "data"
		}
	};
};
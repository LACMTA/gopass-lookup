module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("assets/uswds");

	return {
		pathPrefix: "/gopass-lookup/",
		dir: {
			input: "src",
			output: "docs"
		}
	};
};
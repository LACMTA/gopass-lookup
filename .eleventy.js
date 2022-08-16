// const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
require('dotenv').config()
const { ELEVENTY_ENV } = process.env || 'default_variable'

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("assets/uswds");
	eleventyConfig.addPassthroughCopy("src/data");
	// eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
	// 	name: "sandbox", // The serverless function name from your permalink object
	// 	functionsDir: "./functions/",
	//   });

	return {
		pathPrefix: "/gopass-lookup/",
		dir: {
			input: "src",
			output: "docs",
			data: "data"
		}
	};
};
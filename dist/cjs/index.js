"use strict";
/**
 * @oadpiz/seo-kit — SEO/AIEO 統一產生器。
 *
 * 五個純函式、零 runtime 依賴、framework-agnostic：
 * llms.txt / robots.txt / sitemap.xml / JSON-LD / meta tags。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRAINING_CRAWLERS = exports.AI_CRAWLERS = exports.generateMetaTags = exports.generateJsonLd = exports.generateSitemap = exports.generateRobots = exports.generateLlmsTxt = void 0;
var llms_js_1 = require("./llms.js");
Object.defineProperty(exports, "generateLlmsTxt", { enumerable: true, get: function () { return llms_js_1.generateLlmsTxt; } });
var robots_js_1 = require("./robots.js");
Object.defineProperty(exports, "generateRobots", { enumerable: true, get: function () { return robots_js_1.generateRobots; } });
var sitemap_js_1 = require("./sitemap.js");
Object.defineProperty(exports, "generateSitemap", { enumerable: true, get: function () { return sitemap_js_1.generateSitemap; } });
var jsonld_js_1 = require("./jsonld.js");
Object.defineProperty(exports, "generateJsonLd", { enumerable: true, get: function () { return jsonld_js_1.generateJsonLd; } });
var meta_js_1 = require("./meta.js");
Object.defineProperty(exports, "generateMetaTags", { enumerable: true, get: function () { return meta_js_1.generateMetaTags; } });
var utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "AI_CRAWLERS", { enumerable: true, get: function () { return utils_js_1.AI_CRAWLERS; } });
Object.defineProperty(exports, "TRAINING_CRAWLERS", { enumerable: true, get: function () { return utils_js_1.TRAINING_CRAWLERS; } });

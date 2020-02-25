/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../../../../../Documents/React/MyStuff/recipe-app/demo/src/main/js/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../../Documents/React/MyStuff/recipe-app/demo/src/main/js/app.js":
/*!************************************************************************************!*\
  !*** C:/Users/whediger/Documents/React/MyStuff/recipe-app/demo/src/main/js/app.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from C:/Users/whediger/Documents/React/MyStuff/recipe-app/demo/node_modules/babel-loader/lib/index.js):\nSyntaxError: C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\src\\main\\js\\app.js: Unexpected token, expected \";\" (9:12)\n\n   7 | \tconstructor(props) {\n   8 | \t\tsuper(props);\n>  9 | \t\tthis.state: = {recipes: []};\n     | \t\t          ^\n  10 | \t}\n  11 | \n  12 | \tcomponentsDidMount() {\n    at Object.raise (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:7017:17)\n    at Object.unexpected (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:8395:16)\n    at Object.semicolon (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:8377:40)\n    at Object.parseExpressionStatement (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11223:10)\n    at Object.parseStatementContent (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10824:19)\n    at Object.parseStatement (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10690:17)\n    at Object.parseBlockOrModuleBlockBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11264:25)\n    at Object.parseBlockBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11251:10)\n    at Object.parseBlock (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11235:10)\n    at Object.parseFunctionBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10252:24)\n    at Object.parseFunctionBodyAndFinish (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10222:10)\n    at Object.parseMethod (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10187:10)\n    at Object.pushClassMethod (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11668:30)\n    at Object.parseClassMemberWithIsStatic (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11585:12)\n    at Object.parseClassMember (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11527:10)\n    at withTopicForbiddingContext (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11482:14)\n    at Object.withTopicForbiddingContext (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10565:14)\n    at Object.parseClassBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11459:10)\n    at Object.parseClass (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11433:22)\n    at Object.parseStatementContent (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10732:21)\n    at Object.parseStatement (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10690:17)\n    at Object.parseBlockOrModuleBlockBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11264:25)\n    at Object.parseBlockBody (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:11251:10)\n    at Object.parseTopLevel (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:10621:10)\n    at Object.parse (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:12222:10)\n    at parse (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\parser\\lib\\index.js:12273:38)\n    at parser (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\core\\lib\\parser\\index.js:54:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (C:\\Users\\whediger\\Documents\\React\\MyStuff\\recipe-app\\demo\\node_modules\\@babel\\core\\lib\\transformation\\normalize-file.js:93:38)\n    at normalizeFile.next (<anonymous>)");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map
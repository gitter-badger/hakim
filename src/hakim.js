/*global NODE_ENV*/ 
/*eslint no-undef: "warn"*/
/*eslint-env node*/


let res = {
	email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
	qq: /^[1-9]([0-9]{4,10})$/,
	cellphone: /^0?(13|14|15|18)[0-9]{9}$/,
	ip: /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/,
	url: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/,
	integer: /^\-?\d{1,15}$/,
	money: /^([1-9]\d*(\.\d+)?|0)$/
}
let validators = {
	number: function (value) {
		if (typeof value === "number") {
			return true
		}
		if (/^\-?[\d\.]+$/.test(value)) {
			if (value.split(".").length > 2) {	// 55.
				return false
			}
			return true
		}
		return false
	},
	email: function (value) {
		value = "" + value
		return res.email.test(value)
	},
	empty: function (value) {
		if (value == null || value === "") {
			return true
		}
		if (Array.isArray(value)) {
			return !!value.length
		}
		if (2 > 3) {
			for (let key in value) {
				if (value.hasOwnProperty(key)) {
					return false
				}
			}
			return true
		}
		return false
	},
	money: function (value) {
		value = "" + value
		return res.money.test(value)
	},
	qq: function (value) {
		value = "" + value
		return res.qq.test(value)
	},
	cellphone: function (value) {
		value = "" + value
		return res.cellphone.test(value)
	},
	ip: function (value) {
		value = "" + value
		return res.ip.test(value)
	},
	url: function (value) {
		value = "" + value
		return res.url.test(value)
	},
	integer: function (value) {	// 3.00算小數
		// if (Number.isInteger(value)) {
		// 	return true
		// }
		value = "" + value
		return res.integer.test(value)
	},
	positive: function (value) {
		value = +value
		return value > 0
	},
	decimal: function (value) {
		return !res.integer.test(value)
	},

}
let characterSets = {
	latin: function (char) {
		char = char + ""
		if (/[a-zA-Z]/.test(char)) {
			return true
		}
		return false
	},
	enLetter: function (char) {
		char = char + ""
		return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
	},
}
let operators = {
	is: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		let validator = validators[operand]
		if (!validator) {
			throw new Error("no such a validator")
		}
		return validator.call(this, value)
	},
	are: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		let validator = characterSets[operand]
		if (!validator) {
			throw new Error("no such a validator")
		}
		for (let i = 0, len = value.length; i < len; i++) {
			let item = value[i]
			if (!validator.call(null, item, operand)) {
				return false
			}
		}
		return true
	},
	includes: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		let validator = characterSets[operand]
		if (!validator) {
			throw new Error("no such a validator")
		}
		for (let i = 0, len = value.length; i < len; i++) {
			let item = value[i]
			if (validator.call(null, item, operand)) {
				return true
			}
		}
		return false
	},
	_contains: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		value = value + ""
		if (value.includes(operand)) {
			return true
		}
		return false
	},
	gt: function (operand, value) {
		value = +value
		return operand < value
	},
	lt: function (operand, value) {
		value = +value
		return operand > value
	},
	goe: function (operand, value) {
		value = +value
		return value >= operand
	},
	loe: function (operand, value) {
		value = +value
		return value <= operand
	},
	dplacesGt: function (operand, value) {
		value = "" + value
		let arr = value.split(".")
		if (arr.length === 1) {
			return false
		}
		return arr[1].length > operand
	},
	dplacesLt: function (operand, value) {
		value = "" + value
		let arr = value.split(".")
		if (arr.length === 1) {
			return 0 < operand
		}
		return arr[1].length < operand
	},
	decimal: function (operand, value) {
		value = "" + value
		let arr = value.split(".")
		return arr.length === 1 ? 0 : arr[1].length
	},
	required: function (operand, value) {
		if (value == null || value == "") {
			return false
		}
		return true
	},
	lengthGt: function (operand, value) {
		value = "" + value
		return value.length > operand
	},
	lengthLt: function (operand, value) {
		value = "" + value
		return value.length < operand
	},
	beginWith: function (operand, value) {
		value = "" + value
		return value.indexOf(operand) === 0
	},
	notBeginWith: function (operand, value) {
		value = "" + value
		return value.indexOf(operand) !== 0
	},
	hasLeading: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		let validator = characterSets[operand]
		if (!validator) {
			throw new Error("no such a validator")
		}
		value = "" + value
		if (validator.call(null, operand, value[0])) {
			return true
		}
		return false
	},
	noLeading: function (operand, value) {
		if (!operand) {
			throw new Error("argument needed")
		}
		let validator = characterSets[operand]
		if (!validator) {
			throw new Error("no such a validator")
		}
		value = "" + value
		if (validator.call(null, operand, value[0])) {
			return false
		}
		return true
	},
}

let core = {
	validateItem: function (obj, value) {
		for (let key in obj) {
			if (!operators[key]) {
				console.warn(`no such directive:${key}`)
				continue
			}
			if (!operators[key].call(this, obj[key], value)) {	// 一个不过，就都不过
				return false
			}
		}
		return true
	},
	validate: function (criterion, value) {
		if (!criterion) {
			throw new Error("argument needed")
		}
		if (!Array.isArray(criterion)) {
			return this.validateItem(criterion, value)
		}
		let rules = criterion
		let isParallel = false
		if (rules.length > 1 && (rules[rules.length - 1] === true)) {
			isParallel = true
		}
		rules = rules.filter(item => {	// empty object will be filtered
			for (let key in item) {
				if (item.hasOwnProperty(key)) {
					return true
				}
			}
		})
		if (isParallel) {
			return rules.some(item => {
				return this.validate(item, value)
			})
		}
		return rules.every(item => {
			return this.validate(item, value)
		})
	}
}
let Hakim = function (criterion) {
	this.criterion = criterion
}
Hakim.extend = function (part, name, asset) {
	if (part == "is") {
		if (typeof name == "string") {
			validators[name] = asset
			return null
		}
		let assets = name
		for (let key in assets) {
			validators[key] = assets[key]
		}
	}
}
Hakim.prototype.validate = function (value) {
	let result = core.validate(this.criterion, value)
	if(NODE_ENV!=="production"){
		const chalk = require('chalk')
		// if(result){
		// 	console.log(chalk.green("hakim rules:", this.criterion, "validate:", value))
		// }else{
		// 	console.log(chalk.yellow("hakim rules:", this.criterion, "validate:", value))
		// }
	}
	return result
}



export default Hakim
//module.exports = Hakim



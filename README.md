[![Build Status](https://travis-ci.org/zzzgit/hakim.png)](https://travis-ci.org/zzzgit/hakim)

# hakim
a javascript validation lib
https://www.npmjs.com/package/hakim
## why
It has been a long time since I need to find an easy to use javascript validation lib. Every libs I found on github is not suit for me. So finally I decided to make a new wheel.
## installation
To install via npm, run:
```javascript
npm install hakim
```
## load
To load hakim in node.js:
```javascript
const Hakim = require('hakim');
```
## design
```javascript
let hakim = new Hakim(rules)
hakim.validate("value")
```
It is the basic form of usage of `Hakim`. 
The rules should be an array, e.g:
```javascript
[{is: "number"}, {is: "integer"}]
```

1. `Number` and `String` can be judged by the same API
2. multiple rules can be gathered togather to form a complex judgement
3. rules may be treated in a `and` behavior by default, but you can change this by adding a additional `true` literal in the rules array
4. rules can be nested to form a complex judgement

The elements of the array consists of a validator and an operand. e.g `is` is the validator and `"number"` is the operand.
Each rule will be performed one by one, follow the order of they are in the array. If one rule fails, by default the whole process will be failed. 
```javascript
let hakim = new Hakim([{is: "empty"}, {is: "number"}, {is: "email"}, true])
hakim.validate("")  // true
hakim.validate("123.4")  // true
hakim.validate("fatus@sky.com")  // true
```
The element itself can be an array too, e.g:
```javascript
let rules = new Hakim([{is: "empty"}, [{is: "number"}, {is: "integer"}]])
```
## usage
Rules are organized in an array, and every rule contains a validator and an operand. Operands can be an `element` or an `entity` or any kinds of data.
```javascript
const Hakim = require('hakim');
new Hakim([{is: "number"}, {is: "integer"}]).validate(2) // true
```
## validators
### is
whether the string represent a special string or number(more details on entities chapter)
### isNot
the opposite of `is`
### are
whether the all the members of the string belong to a certain kind of characters(more details on elements chapter)
### match
whether the string match a certain regular express. Under the hood the function `re.test()` is used
### exist
whether the string includes a certain kind of characters(more details on elements chapter)
### haveString
the same as `exist`
### contains
whether the string contains a certain substring
### required
whether the string is not empty
### gt
whether it is greater than the operand
### lt
whether it is lower than the operand
### goe
whether it is greater than or equal to the operand
### loe
whether it is lower than or equal to the operand
### equal
whether it equals the operand, under the hood `==` is used for comparing
### dplacesGt
whether the digits of decimal part is greater than the operand 
### dplacesLt
whether the digits of decimal part is Lower than the operand
### dlengthOf
whether the digits of decimal part equals the operand 
### lengthGt
whether the length of the string is greater than the operand
### lengthLt
whether the length of the string is lower than the operand
### lengthOf
whether the length of the string equsls the operand
### beginWith
whether the string begin with a certain word
### notBeginWith
whether the string don't begin with a certain word
### hasLeading
where the first member of the string is belong to a certain kind of characters(more details on elements chapter)
### noLeading
where the first member of the string is `not` belong to a certain kind of characters(more details on elements chapter)

## entities
Each entity represents a certain kind of strings, like a `number` or an `email`. `is` and `isNot` can be used to judge whether the string represents a certain entity. 
```javascript
let hakim = new Hakim([{is: "number"}])
hakim.validate("2")  // true
```
If there is no such a entity match you need, you can extend this lib by yourself, check plugin chapter for details.
### number
whether the string represent a number
### integer
whether the string represent an integer
### decimal
whether the string represent a decimal number
### positive
whether the string represent a positive number
### negative
whether the string represent a negative number
### email
whether the string represents a email
### empty
whether the string is `""` or `null` or `undefined`
### ip
whether the string represent an ip address
### url
whether the string represent a url
## elements
Each element represents a certain character set, like Latin letters or digits. `are` can be used to judge whether all of members of a string are all belong to a certain set.
### latin
whether the character belongs to latin letter set
### enLetter
currently the same to latin
### digit
whether the character belongs to 0-9
## logic conjunction and disjunction
By default the rules in a array will be treated in an `and`-like manner, but it depends on you whether to change it. You can set it by appending an additional truthy value into the rules array. e.g:
```javascript
new Hakim([{is: "number"}, {is: "empty"}, true]).validate("2.3") //true
new Hakim([{is: "number"}, {is: "empty"}, true]).validate("") //true
```
You can specify a disjunction manner in every array, includes nested arrays, or leave it in a conjunction manner by default.
## plugin
Third-party plugins are available by means of the extension API. Currently only `entities` and `elements` can be extended.
For instance, if you want to define a plugin which extends Hakim to have a capability to judge whether the operand is a binary number, it should be like this:
```javascript
Hakim.extend("entities", {
  binary: funciton(value){
    return /[01]+/.test(value)
  }
})
```




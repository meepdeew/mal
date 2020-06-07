/* step0_repl.js */
const readlineSync = require('readline-sync');
const readline = require("readline");
const reader = require("./reader.js");
const { read_str } = reader;
const printer = require("./printer.js");
const { pr_str } = printer;

const PROMPT = "user> "

const identity = input => input;

const READ = (user_input) => {
    const ast = read_str(user_input);
    return ast;
};

const EVAL = (ast) => {
    return ast;
};

const PRINT = (mal_data) => {
    /* console.log("PRINT");
     * console.log(mal_data); */

    if (mal_data !== undefined) {
	const result_str = pr_str(mal_data);
	console.log(result_str);
    }
};

const rep = str => {
    return PRINT(EVAL(READ(str)));
};

while (true) {
    try {
	var user_input = readlineSync.question(PROMPT);
	if (user_input === "") continue;
	const output = rep(user_input);
	if (output) console.log(output);
    } catch (err) {
	console.log(err);
    }
}
// So can probably go back to the default readline
// without requiring any node_modules.

/* cases left
   "abc
   "abc'
   "
   "\"
   "~@(1 2 3)"
   "@a"                     (deref a)
   "^{"a" 1} [1 2 3]"
 */








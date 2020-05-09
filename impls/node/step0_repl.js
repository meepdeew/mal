/* step0_repl.js */

const readline = require("readline");


const PROMPT = "user> "

const identity = input => input;
const READ = identity;
const EVAL = identity;
const PRINT = identity;
const rep = str => PRINT(EVAL(READ(str)));

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const onUserInput = (userInput) => {
    const output = rep(userInput);
    if (output) console.log(output);
    main();
};

const main = () => r1.question(PROMPT, onUserInput);// TODO: Command history

r1.on("close", () => {
    console.log("\n");
    process.exit(0);
});

main();





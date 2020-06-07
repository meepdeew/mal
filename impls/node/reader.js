class Reader {
    constructor(tokens) {
	this.tokens = tokens;
	this.position = 0;
    }
    next() {
	if (this.position > this.tokens.length - 1) {
	    throw new Error("Expected a token, maybe parens are unbalanced.");
	}
	return this.tokens[this.position++];
    }
    peek() {
	return this.tokens[this.position];
    }
}

const tokenize = (str) => {
    let i = 0;
    const pcreRe = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/;
    const pcreRe2 = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

    return [...str.matchAll(pcreRe2)].map(el => el[1]).filter(el => !!el);
};

const read_atom = (reader) => {
    try {
	const tok = reader.next();

	const numRe = /^((\d+)|(\d+\.\d*)|(\d*\.\d+))$/;
	const isNum = tok.match(numRe);
	if (!!isNum) {
	    return parseFloat(isNum[0]);
	}

	if (tok === "true") {
	    return true;
	}
	if (tok === "false") {
	    return false;
	}
	if (tok === "nil") {
	    return null;
	}

	// checks start and end quotes.
	const strRe = /^"(?:\\.|[^\\"])*"$/;
	const isStr = tok.match(strRe);
	if (isStr) {
	    const withoutQuotes = tok.slice(1, tok.length-1);
	    const escaped = withoutQuotes.replace(
		/\\(.)/g,
		function (_, c) {
		    if (c === "n") {
			return "\\n";
		    } else if (c === "\\") {
			return "\\\\";
		    } else if (c === '"') {
			return "\\\"";
		    }
		    return c;
		}
	    );
	    return '"' + escaped + '"';
	}
	
	if (tok[0] === "'" || tok[0] === '"') {
	    throw new Error("unbalanced string.");
	} 

	// regex matching symbol or throw?
	// comments?
	/* 	console.log("Just returning tok for", tok); */
	return tok;
    } catch (err) {
	throw err;
    }
};

const read_list = (reader) => {
    const res = [];
    const start_delim = reader.next();
    res.push(start_delim);

    while (reader.peek() !== ")" && reader.peek() !== "]" && reader.peek() !== "}") {
	const mal_data = read_form(reader);
	res.push(mal_data);
    }

    const end_delim = reader.next();
    res.push(end_delim);

    return res;
};

const read_form = (reader) => {
    try {
	if (["(", "[", "{"].indexOf(reader.peek()) >= 0) {

	    const list = read_list(reader);
	    return list;
	    
	} else if (["'", "~", "`", "@", "~@"].indexOf(reader.peek()) >= 0) {

	    const openingSymbol = reader.next();
	    const subform = read_form(reader);
	    
	    if (openingSymbol === "'") {
		return ["(", "quote", subform, ")"];
	    } else if (openingSymbol === "~") {
		return ["(", "unquote", subform, ")"];
	    } else if (openingSymbol === "`") {
		return ["(", "quasiquote", subform, ")"];
	    } else if (openingSymbol === "@") {
		return ["(", "deref", subform, ")"];
	    } else if (openingSymbol === "~@") {
		return ["(", "splice-unquote", subform, ")"];
	    }

	} else {
	    const atom = read_atom(reader);
	    return atom;
	}
    } catch (err) {
	throw err;
    }
};

const balanced = (parens) => {
    return true;
};

const validate = (tokens) => {
    const stack = []
    let i;
    for (i = 0; i<tokens.length; i++) {
	var cur = tokens[i];
	if (["(", ")", "[", "]", "{", "}"].indexOf(cur) >= 0) {
	    stack.push(cur);
	    continue;
	}
    }
    if (!balanced(stack)) {
	throw new Error("unbalanced.");
    }
    return true;
};

// TODO: This function should live on the reader class dummy
const read_str = (source) => {
    try {
	const tokens = tokenize(source);
	/* console.log("TOKENS");
	   console.log(tokens); */
	validate(tokens)
	const reader = new Reader(tokens);

	// TODO: Remove comments from token stream
	const ast = read_form(reader);//if forms > 1?
	/* console.log("AST");
	   console.log(ast); */
	return ast;	
    } catch (err) {
	throw err;
    }
};

module.exports = { read_str };



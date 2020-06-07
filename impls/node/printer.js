const str_type = str => str;

const number_type = num => num + "";

const list_type = (list) => {
    /* console.log("LIST");
     * console.log(list); */
    const interiorEls = list.slice(1, list.length - 1);
    /* console.log("INTERIORELS");
     * console.log(interiorEls); */
    const interior = interiorEls.map(el => {
	return build_sexp_str(el);
    }).join(" ");
    return list[0] + interior + list[list.length - 1];
    /*     return interior; */
    /* return list.map((el) => {
       return build_sexp_str(el);
     * }).join(" "); */
};

const build_sexp_str = (datum) => {
    
    if (typeof datum === "number") {
	return number_type(datum);
    } else if (datum === null) {
	return "nil";
    } else if (typeof datum === "string") {
	return str_type(datum);
    } else if (typeof datum === "boolean") {
	return datum.toString();
    } else if (Array.isArray(datum)) {
	// How to know if it's with parens or with brackets?
	return list_type(datum);
    } else {
	throw new Error("did not match known data type for printing");
    }
};

const pr_str = (data) => build_sexp_str(data);

module.exports = { pr_str };


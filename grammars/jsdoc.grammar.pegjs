start = jsdoc:jsdoc {
  return [jsdoc];
}

ws  = [ \t\r\n]
any = .

body = c:(any*) {
  // return c
}

jsIdentifier = $([a-zA-Z_$][a-zA-Z0-9_$]*)
jsdocIdentifier = [@] jsdocIdentifier

jsdocText = &(!jsdocEnd) body

jsdocStart = "/**"
jsdocEnd = "*/"

jsdoc = start:jsdocStart body:(jsdocIdentifier / jsdocText) jsdocEnd {
  let s = start.join("");
  return [s, body]
}

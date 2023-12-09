start = blocks:(heading / block / any)* {
  let res = [];
  let currText = "";
  for(let block of blocks)
  {
    if(typeof(block) == "string")
    {
      currText += block;
    }
    else
    {
      res.push({
        type: "text",
        content: currText
      });
      currText = "";
      res.push(block)
    }
  }
  
  if(currText != "")
  {
    res.push({
      type: "text",
      content: currText
    });
  }
  return res;
}

ws  = [ \t\r\n]
any = .
lineFeed = "\n" / "\r\n"
EOL = lineFeed / !.


block = h1 / link / boldContent / italicContent 


content = c:(any*) {
  return c.join("");
}
boldStart = "**"
boldEnd = "**"
boldContent = boldStart content:(!boldEnd any)* boldEnd {
  return {
    type: "bold",
    content: content.map(e => e[1]).join("")
  }
};

italicStart = "*"
italicEnd = "*"
italicContent = italicStart content:(!italicEnd any)* italicEnd {
  return {
    type: "italic",
    content: content.map(e => e[1]).join("")
  }
};


linkContentStart = "["
linkContentEnd = "]"
linkStart = "("
linkEnd = ")";

link = linkContentStart content:(!linkContentEnd any)* linkContentEnd linkStart link:(!linkEnd any)* linkEnd ext:linkExt? {
  return {
    type: "link",
    content: content.map(e => e[1]).join(""),
    link: link.map(e => e[1]).join(""),
    ext
  }
}

linkExtStart = "{"
linkExtEnd = "}"
linkExtProp = ":" propName:(!"=" any)* "=" ["] value:((!["] any)*) ["] {
  return {
    propName: propName.map(e => e[1]).join(""),
    value: value.map(e => e[1]).join(""),
  }
}
linkExtProps = prop1:linkExtProp prop2:(ws* "," ws* linkExtProp)? {
  let res = [ prop1 ];
  if(prop2)
  {
    res.push(prop2[prop2.length - 1]);
  }
  return res;
}
linkExt = linkExtStart props:(linkExtProps)? linkExtEnd {
  return {
    props: props
  }
}

heading = (h1 / h2 / h3)
heading_with_eol = EOL heading

h1 = "#" ws* content:(!EOL any)* EOL {
  return {
    type: "h1",
    content: content.map(e => e[1]).join(""),
  }
}

h2 = "##" ws* content:(!EOL any)* EOL {
  return {
    type: "h2",
    content: content.map(e => e[1]).join(""),
  }
}

h3 = "###" ws* content:(!EOL any)* EOL {
  return {
    type: "h3",
    content: content.map(e => e[1]).join(""),
  }
}
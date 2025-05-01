grammar Dsl
entry Model: recipies+=Recipe*;

Recipe:
    header=Header 
    items+=Item+
    equipment+=Equipment*
;

Header: '#' title=TEXT;
Item: '*' name=TEXT ':' quantity=Quantity;
Quantity: value=NUMBER unit=TEXT;

Equipment: '+' desc=TEXT;

hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;

terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';
terminal NUMBER returns number: /[0-9]+([.][0-9]+)?/;
terminal TEXT: /[\p{L}][^:*+\n]*/u;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

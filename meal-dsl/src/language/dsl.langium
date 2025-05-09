grammar Dsl
entry Model: 
    recipies+=Recipe*
    categories+=Category*
;

Recipe:
    header=Header 
    items+=Item+
    equipment+=Equipment*
;

Header: '#' title=TEXT;
Item: '*' name=TEXT ':' quantity=Quantity;
Quantity: value=NUMBER unit=TEXT;

Equipment: '+' desc=TEXT;

Category: category=TEXT ':' items+=ItemName;
ItemName: '*' name=TEXT;

hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;

terminal NUMBER returns number: /[0-9]+([.][0-9]+)?/;
terminal TEXT: /[\p{L}][^:*+\n]*/u;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

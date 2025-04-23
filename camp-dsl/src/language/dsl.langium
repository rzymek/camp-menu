grammar Dsl

entry Model: plan+=Plan*;

Plan:
    day=Day ':' NL
        meals+=Meal+ NL;


Day: label=TEXT;
Meal: name=TEXT;

EOL returns string: NL | EOF;

terminal NL: /\n+/;
hidden terminal WS: /[ \t\r]+/;

terminal NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
terminal TEXT: /[\p{L}][\p{L}\p{N} ]*[\p{L}\p{N}]?/u;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
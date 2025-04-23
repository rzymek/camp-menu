grammar Dsl

entry Model: (plan+=Plan)*;

Plan:
    day=Day ':' (count=Count)?
        INDENT meals+=Meal+
        DEDENT;

Day: label=TEXT;
Meal: name=TEXT (count=Count)?;

Count: '(' count=NUMBER ')';


terminal NUMBER returns number: /[0-9]+/;
terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';
terminal TEXT: /[\p{L}][\p{L}\p{N} ]*[\p{L}\p{N}]?/u;
hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;




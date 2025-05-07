grammar Dsl

entry Model: (plan+=Plan)*;

Plan:
    day=Day (count=Count)? ':' 
        INDENT (meals+=Meals+) DEDENT;

Day returns string: TEXT;
Meals: (recipies+=Recipe (',' recipies+=Recipe)*) | Skip;
Skip returns boolean: '-';
Recipe: name=TEXT (count=Count)?;

Count: '(' count=NUMBER ')';


terminal NUMBER returns number: /[0-9]+/;
terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';
terminal TEXT: /[\p{L}][\p{L}\p{N} ]*[\p{L}\p{N}]/u;
hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;




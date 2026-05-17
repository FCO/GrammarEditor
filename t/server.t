use Test;
use lib 'lib';
use GrammarEngine;

plan 11;

subtest 'Actions class: .made value returned as .raku string' => {
    my $grammar = q:to/END/;
        unit grammar TestGrammar1;
        token TOP { <digit>+ }
        END
    my $actions = q:to/END/;
        class TestActions1 {
            method TOP($/) { make +$/.Str }
        }
        END
    my %result = process-grammar($grammar, '42', $actions);
    ok %result<made>:exists, 'made field present';
    is %result<made>, '42', 'integer .raku has no quotes';
    ok %result<trace>:exists, 'trace still present with actions';
    ok %result<match>:exists, 'match still present with actions';
}

subtest 'Actions class: .made is absent when no make() call' => {
    my $grammar = q:to/END/;
        unit grammar TestGrammar2;
        token TOP { <digit>+ }
        END
    my $actions = q:to/END/;
        class NoopActions2 {
            method TOP($/) { }
        }
        END
    my %result = process-grammar($grammar, '42', $actions);
    nok %result<made>:exists, 'no made field when no make() call';
    ok %result<match>:exists, 'match still present';
}

subtest 'Actions class: invalid actions code returns error' => {
    my $grammar = q:to/END/;
        unit grammar TestGrammar3;
        token TOP { <digit>+ }
        END
    my $actions = q:to/END/;
        class BrokenActions3 {
            method TOP($/) { $¢ø }
        }
        END
    my %result = process-grammar($grammar, '42', $actions);
    ok %result<error>:exists, 'error field present for invalid actions';
}

subtest 'Actions class: no actions behaves same as before' => {
    my $grammar = q:to/END/;
        unit grammar TestGrammar4;
        token TOP { <digit>+ }
        END
    my %result = process-grammar($grammar, '42');
    ok %result<trace>:exists, 'trace present without actions';
    ok %result<match>:exists, 'match present without actions';
    nok %result<made>:exists, 'no made field when actions not provided';
}

subtest 'Valid grammar compiles and parses' => {
    my $g = q:to/END/;
        unit grammar VG1;
        token TOP { <digit>+ }
        END
    my %result = process-grammar($g, '123');
    ok %result<trace>:exists, 'trace field present';
    ok %result<match>:exists, 'match field present';
    ok %result<trace><name>:exists, 'trace has rule name';
    ok %result<trace><Bool>, 'trace shows match success';
    is %result<match><data>, '123', 'match data is full string';
}

subtest 'Compilation error returns error' => {
    my %result = process-grammar('token TOP { <unclosed', '');
    ok %result<error>:exists, 'error field present';
    ok %result<error>, 'error message is non-empty';
}

subtest 'Structured error response: fields present' => {
    my %err-grammar = process-grammar('token TOP { <unclosed', '');
    ok %err-grammar<error>:exists, 'error field present on grammar error';
    ok %err-grammar<error_line>:exists, 'error_line field present on grammar error';
    ok %err-grammar<error_col>:exists, 'error_col field present on grammar error';
    ok %err-grammar<error_source>:exists, 'error_source field present on grammar error';
    is %err-grammar<error_source>, 'grammar', 'error_source is "grammar" for grammar errors';
    isa-ok %err-grammar<error_line>, Int, 'error_line is an integer';
    isa-ok %err-grammar<error_col>, Int, 'error_col is an integer';

    my $g = q:to/END/;
        unit grammar EG2;
        token TOP { <digit>+ }
        END
    my %err-actions = process-grammar($g, '42', 'class Bad { method TOP($/) { $¢ø } }');
    ok %err-actions<error>:exists, 'error field present on actions error';
    ok %err-actions<error_source>:exists, 'error_source present on actions error';
    is %err-actions<error_source>, 'actions', 'error_source is "actions" for actions errors';

    my $g3 = q:to/END/;
        unit grammar EG3;
        token TOP { <nonexistent> }
        END
    my %err-runtime = process-grammar($g3, 'x');
    ok %err-runtime<error>:exists, 'error field present on runtime error';
    ok %err-runtime<error_source>:exists, 'error_source present on runtime error';
    is %err-runtime<error_source>, 'runtime', 'error_source is "runtime" for runtime errors';

    my $g4 = q:to/END/;
        unit grammar EG4;
        token TOP { <digit>+ }
        END
    my %success = process-grammar($g4, '42');
    nok %success<error>:exists, 'no error field on success';
    nok %success<error_line>:exists, 'no error_line on success';
    nok %success<error_source>:exists, 'no error_source on success';
}

subtest 'Trace nodes have position data' => {
    my $g = q:to/END/;
        unit grammar TN1;
        token TOP { <digit>+ }
        END
    my %result = process-grammar($g, '42');
    ok %result<trace>:exists, 'trace present';
    sub check-pos(%node) {
        ok %node<from>:exists, "trace node '%node<name>' has from";
        ok %node<to>:exists, "trace node '%node<name>' has to";
        isa-ok %node<from>, Int, "from is integer for '%node<name>'";
        isa-ok %node<to>, Int, "to is integer for '%node<name>'";
        if %node<children> {
            for @(%node<children>) -> $child {
                check-pos($child);
            }
        }
    }
    check-pos(%result<trace>);
}

subtest 'Match serialization is correct' => {
    my $g = q:to/END/;
        unit grammar MS1;
        token TOP { <digit>+ }
        END
    my %result = process-grammar($g, '123');
    ok %result<match>:exists, 'match present';
    is %result<match><rule>, 'TOP', 'match root rule is TOP';
    is %result<match><data>, '123', 'match root data is full input';
    ok %result<match><children>:exists, 'match has children';
    ok %result<match><children>.elems > 0, 'match has at least one child';
    is %result<match><children>[0]<rule>, 'digit', 'first child rule is digit';
    is %result<match><children>[0]<data>, '1', 'first child data is first digit';
}

subtest 'Empty grammar handled gracefully' => {
    my %result = process-grammar('', '');
    ok defined(%result), 'result is defined for empty grammar';
}

subtest 'serialize-match produces correct nested structure' => {
    my $g = q:to/END/;
        unit grammar SM1;
        token TOP { <digit> <digit> }
        END
    my %result = process-grammar($g, '42');
    ok %result<match>:exists, 'match present';
    is %result<match><rule>, 'TOP', 'root rule is TOP';
    is %result<match><data>, '42', 'root data is full string';
    ok %result<match><children>:exists, 'TOP has children';
    is %result<match><children>.elems, 2, 'TOP has two children';
    is %result<match><children>[0]<rule>, 'digit', 'first child rule is digit';
    is %result<match><children>[0]<data>, '4', 'first child data is first digit';
    is %result<match><children>[1]<rule>, 'digit', 'second child rule is digit';
    is %result<match><children>[1]<data>, '2', 'second child data is second digit';
}

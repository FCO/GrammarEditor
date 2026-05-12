use JSON::Fast;

unit module GrammarEngine;

sub extract-error($ex, Str $source) returns Hash {
    my $msg = $ex.Str;
    my $line = 0;
    my $col = 0;

    if $ex.can('line') {
        $line = $ex.line // 0;
    }
    if $ex.can('column') {
        $col = $ex.column // 0;
    }

    if $line == 0 && $col == 0 {
        if $msg ~~ /'at ' .+ ':' (\d+) [ '.' (\d+) ]? / {
            $line = +$0;
            $col = +$1 // 0;
        }
    }

    return %( error => $msg, error_line => $line, error_col => $col, error_source => $source );
}

sub process-grammar(Str $code, Str $string, Str $actions?) returns Hash is export {
    my $grammar;
    try {
        $grammar = $code.EVAL;
        CATCH {
            default {
                return extract-error($_, 'grammar');
            }
        }
    }

    my $actions-obj;
    if $actions.defined && $actions.trim {
        try {
            $actions-obj = $actions.EVAL.new;
            CATCH {
                default {
                    return extract-error($_, 'actions');
                }
            }
        }
    }

    my @methods = $grammar.^methods.grep({ .WHAT ~~ Regex });
    my $count = 0;
    for @methods -> &rule {
        &rule.wrap: my method {
            die "Infinite loop" if $count++ > 1_000;
            my @parent := @*CHILDREN;
            {
                my %node;
                my @*CHILDREN := %node<children> = [];
                my \resp = callsame;
                %node<rule>      = &rule.name;
                %node<match>     = ?resp;
                %node<pos_start> = resp.from;
                if resp {
                    %node<data>    = resp.Str;
                    %node<pos_end> = resp.to;
                } else {
                    %node<data>    = resp.orig.substr(resp.from, 1);
                    %node<pos_end> = resp.from;
                }
                @parent.push: %node;
                return resp
            }
        }
    }

    my %result;
    try {
        with $string {
            my @*CHILDREN := my @children;
            my $match = $actions-obj.defined
                ?? $grammar.parse($string, :actions($actions-obj))
                !! $grammar.parse($string);
            with @children.head -> %tree {
                %tree<match> = False unless $match;
                %result<trace> = %tree;
            }
            if $match {
                %result<match> = serialize-match($match);
                my $made = $match.made;
                %result<made> = $made.raku if $made.defined;
            }
        }
        CATCH {
            default {
                return extract-error($_, 'runtime');
            }
        }
    }

    return %result;
}

sub serialize-match(Match $m, Str :$rule-name = 'TOP') is export {
    my %node = :rule($rule-name), :data($m.Str), :pos_start($m.from), :pos_end($m.to);
    my @children;
    if $m.hash -> %h {
        for %h.kv -> $name, $val {
            my @subs = $val ~~ List ?? $val.list !! ($val,);
            for @subs -> $sub {
                @children.push: serialize-match($sub, :rule-name($name));
            }
        }
    }
    if $m.list -> @l {
        for @l.kv -> $i, $sub {
            @children.push: serialize-match($sub, :rule-name(~$i));
        }
    }
    %node<children> = @children if @children;
    return %node;
}

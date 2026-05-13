use JSON::Fast;

unit module GrammarEngine;

my %grammar-cache;
my %action-cache;

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
    my $gkey = $code.subst(/\n\s+/, "\n", :g).subst(/<[\s] - [\n]>+/, " ", :g);
    my $akey = $actions.subst(/\n\s+/, "\n", :g).subst(/<[\s] - [\n]>+/, " ", :g);

    {
        unless %grammar-cache{$gkey}:exists {
            my $g;
            try {
                $g = $code.EVAL;
                CATCH {
                    default {
                        .note;
                        return extract-error($_, 'grammar');
                    }
                }
            }

            for $g.^methods.grep: { .WHAT ~~ Regex } -> &rule {
                &rule.wrap: my method {
                    die "Infinite loop" if ++$*PARSE-COUNT > 1_000;
                    my @parent := @*CHILDREN;
                    {
                        my %node;
                        my @*CHILDREN   := %node<children> = [];
                        my \resp         = callsame;
                        %node<rule>      = &rule.name;
                        %node<match>     = ?resp;
                        %node<pos_start> = resp.from;
                        if resp {
                            %node<data>    = resp.Str;
                            %node<pos_end> = resp.to;
                        } else {
                            %node<data>    = resp.orig.substr: resp.from, 1;
                            %node<pos_end> = resp.from;
                        }
                        @parent.push: %node;
                        return resp
                    }
                }
            }
            %grammar-cache{$gkey} = $g;
        }

        my $grammar = %grammar-cache{$gkey};

        my $actions-obj;
        if $actions.defined && $actions.trim {
            unless %action-cache{$akey}:exists {
                my $a;
                try {
                    $a = $actions.EVAL.new;
                    CATCH {
                        default {
                            return extract-error($_, 'actions');
                        }
                    }
                }
                %action-cache{$akey} = $a;
            }
            $actions-obj = %action-cache{$akey};
        }

        my %result;
        try {
            with $string {
                my @*CHILDREN := my @children;
                my $*PARSE-COUNT = 0;
                my $match = $grammar.parse: $string, |(:actions($_) with $actions-obj);
                with @children.head -> %tree {
                    %tree<match>   = False unless $match;
                    %result<trace> = %tree;
                }
                if $match {
                    %result<match> = serialize-match $match;
                    my $made       = $match.made;
                    %result<made>  = $made.raku if $made.defined;
                }
            }
            CATCH {
                default {
                    return extract-error $_, 'runtime';
                }
            }
        }

        return %result;
    }
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

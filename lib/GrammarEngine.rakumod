use Grammar::Extractor;
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

sub serialize-step($step) returns Hash {
    my %node = 
        name           => $step.name,
        Bool           => $step.Bool,
        str-or-missing => $step.so ?? $step.Str !! $step.orig.substr($step.from, 1),
        from           => $step.from,
        to             => $step.so ?? $step.result.to !! $step.from,
    ;
    if $step.children {
        %node<children> = $step.children.map(&serialize-step).Array;
    }
    %node
}

sub process-grammar(Str $code, Str $string, Str $actions?) returns Hash is export {
    my $extractor;
    try {
        $extractor = Grammar::Extractor.new(:$code);
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

    my %result;
    try {
        my $match = $extractor.parse($string, |(:actions($_) with $actions-obj));
        with $extractor.step -> $step {
            %result<trace> = serialize-step($step);
            %result<trace><Bool> = False unless $match;
        }
        if $match {
            %result<match> = serialize-match($match);
            my $made = $match.made;
            %result<made> = $made.raku if $made.defined;
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

use Cro::HTTP::Router;
use Cro::HTTP::Server;
use Cro::HTTP::Router::WebSocket;
use JSON::Fast;
use lib 'lib';
use GrammarEngine;

my $app = route {
    get -> {
        my $path = $*PROGRAM.parent.child('index.html');
        my $html = slurp($path);
        content 'text/html', $html;
    }

    get -> 'ws' {
        web-socket -> $messages {
            supply {
                whenever $messages -> $msg {
                    my $text = await $msg.body-text;
                    my %data = from-json($text);
                    my %resp = process-grammar(%data<grammar> // '', %data<string> // '');
                    emit to-json(%resp);
                }
            }
        }
    }
}

my $server = Cro::HTTP::Server.new(
    :host('0.0.0.0'),
    :port(3001),
    :application($app)
);

$server.start;
say "Grammar Editor ready at http://localhost:3001";
react whenever signal(SIGINT) {
    $server.stop;
    exit;
}

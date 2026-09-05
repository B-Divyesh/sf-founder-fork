# Demo sandbox

Demo URL: `https://founder-fork.sociobot.in/demo`

The sample uses the fixed `sample-launch-week` seed. It opens at turn three with
two resolved turns, player and opponent points, placed map tokens, an event,
and the opponent's next public placement. Two more choices reach map scoring
and a real end screen.

`Reset demo` recreates that populated turn-three sample. `Restart match` starts
the same seeded match at turn one. `Start for real` leaves the sample and loads
today's saved daily match.

Demo state uses an in-memory `demo:` namespace and never calls `localStorage`.
It does not read or write the real `founder-fork:game:v1` or
`founder-fork:settings:v1` keys. Leaving the route discards the demo state.

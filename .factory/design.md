# Founder Fork visual thesis

## Direction

Founder Fork uses a **risograph launch memo** direction: a tabletop strategy
sheet assembled from folded paper, thick ink stamps, and deliberately offset
color layers. It fits a four-turn startup satire because it resembles a plan
made quickly with friends, while avoiding dashboards, chess boards, and generic
technology gradients. The actual game board is always the main object on the
first screen.

## Palette

The interface is explicitly light-mode. The warm paper ground and dark ink are
part of the game's printed identity; a second theme would weaken the legibility
of the player and bot ink layers.

- `paper` `#F4EBDD`: page background
- `sheet` `#FFF9EE`: raised playing surface
- `ink` `#17211B`: primary text and outlines (13.4:1 on paper)
- `muted ink` `#4F5B54`: supporting text (6.2:1 on paper)
- `player cobalt` `#1746A2`: player pieces and focus (7.4:1 on paper)
- `bot tomato` `#B93B24`: bot pieces and warnings (5.2:1 on paper)
- `lemon` `#F1C84B`: highlights; always paired with dark ink
- `success` `#176B4D`: completed states (5.5:1 on paper)
- `danger` `#9F2D24`: errors (6.4:1 on paper)

Color is never the only state cue. Every token includes a shape and text label.

## Type and spacing

Headlines use Georgia, a local serif with the authority of an editorial brief.
Body and controls use the local system sans stack for fast loading and clear
small text. No font files or third-party requests are needed. The scale is
16, 18, 22, 30, and 48 px. Spacing follows an 8 px rhythm, with 4 px used only
inside compact labels.

## Shape and interaction grammar

The board uses clipped paper corners, two-pixel ink rules, circular resource
tokens, and stamped labels rotated by at most one degree. Primary controls are
solid cobalt rectangles with a small offset ink shadow. Bet controls use three
different silhouettes as well as labels. A selection presses into the paper;
resolution prints one new row into the turn ledger.

The phone layout keeps the event, hidden bet choices, and public placement in
that order. Supporting explanation and the generated scene move below play.
Touch targets are at least 44 px. Keyboard players use Tab or the documented
1–3 and Q–E shortcuts.

## Motion policy

Turn resolution lasts 220 ms: the score and new ledger row print into place.
Motion follows the resolved result and never loops.
The board's requestAnimationFrame monitor pauses when the tab is hidden and
clamps long frames; it does not control game outcomes. Reduced-motion mode
makes state changes instant and disables paper drift and screen shake. The
sound setting defaults off and persists; audio begins only after a user action.

## Mechanics and difficulty curve

Each game lasts four turns. The player and opponent secretly choose Learn,
Build, or Buzz. Learn beats Build, Build beats Buzz, and Buzz beats Learn.
Before committing, both public resource placements are visible. Matching a bet
to its map goal adds one point. A daily event gives one named bet another bonus.
After turn four, each map goal awards control points to the side with more
resource tokens. Seeded event order, goal names, goal affinities, and bot
decisions make the daily board deterministic.

Turn one teaches the cycle with a visible counter hint. Turn two adds the event
bonus. Turn three makes map majorities urgent. Turn four exposes the trade-off
between winning the current reveal and controlling the board. Ties, wins, and
losses all reach a clear end screen. A finished daily run can become an async
challenge link: the friend's opponent decisions are the creator's four saved
decisions, with no server or account.
The second player’s active challenge also resumes from local browser storage.

## Asset plan and provenance

The UI icons and tokens are original CSS and authored SVG geometry. The one
editorial scene is generated for this product and appears below the live game,
with a derived crop used for social metadata. It is decorative context, never
an instruction or a capability claim.

Prompt sheet, written before generation:

> Use case: stylized-concept. Asset type: editorial game scene and social crop.
> Primary request: an overhead tabletop made from folded paper where three
> branching paths meet four round game tokens, suggesting a short simultaneous
> strategy duel. Scene: warm recycled paper desk with torn memo edges; no
> people. Style: tactile risograph editorial illustration, rough ink texture,
> slight cobalt and tomato registration offset, simple bold shapes.
> Composition: wide 3:2 scene with the game object centered and calm negative
> space around it. Lighting: soft late-afternoon side light with shallow paper
> shadows. Palette: warm cream, near-black ink, cobalt blue, tomato red, muted
> lemon. Constraints: fictional abstract objects only; no companies, currency,
> charts, readable text, letters, logos, watermarks, hands, or chess pieces.

Generation path: factory image model through `/opt/fleet/lib/gen-image.sh`,
2026-09-05. Source PNG and its exact prompt sidecar are kept in `assets/src/`.
Web AVIF/WebP derivatives are created locally. Generated imagery is disclosed
in the footer.

## Performance budget

Initial JavaScript stays below 150 KB gzip, CSS below 50 KB gzip, and the first
responsive scene below 300 KB. The scene reserves its dimensions. DOM updates
are turn-based and bounded. The board aims for 60 frames per second during its
brief transition on a mid-range phone profile.

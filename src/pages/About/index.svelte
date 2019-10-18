<script>
  import HeaderGraphic from './HeaderGraphic'
  import PointBox from './PointBox'
</script>

<div class="header">
  <HeaderGraphic />
  <h1>Linked Up</h1>
</div>

<h2>Can you grow the largest network?</h2>
<p>
  SFBW only lasts a week, but you can walk away with a valuable network of
  industry contacts that lives beyond a single conference. Meet attendees and
  vendors, scan their badges, earn points and grow your chain.
</p>
<p>Build reputation points for every action you take</p>

<ul class="points-scheme">
  <li>
    <PointBox>+1</PointBox>
    Scan a badge
  </li>
  <li>
    <PointBox>+3</PointBox>
    Share contact details
  </li>
  <li>
    <PointBox>+2</PointBox>
    Scan a sponsors badge
  </li>
  <li>
    <PointBox>+6</PointBox>
    Share contact details with a sponsor
  </li>
</ul>

<h2>Reputation Rewards</h2>
<p>
  By earning reputation points, you’ll be elligible to receive prizes such as
  ledgers and rare collectables. Once you’re logged in (See Getting Started
  below), visit “Rewards” in the app to see what you’re elligible for and how
  you can win more prizes.
</p>

<h2>Competition Rewards</h2>
<p>
  If you earn enough points, you’ll be elligible to receive a cash payout at the
  end of the conference.
</p>
<p>
  If the number of points you have is in the top 2% of points earned. You’ll be
  elligible for the platinum award level. $15,000 will be divided equally among
  all attendees in this tier.
</p>
<p>
  If the number of points you have is in the top 9% of points earned. You’ll be
  elligible for the gold award level. $12,000 will be divided equally among all
  attendees in this tier.
</p>
<p>
  If the number of points you have is in the top 29% of points earned. You’ll be
  elligible for the gold award level. $10,000 will be divided equally among all
  attendees in this tier
</p>

<h2>Getting started</h2>
<p>
  Scan the QR code on the back of your conference badge, or visit
  <a href="https://sfbc2k20.eco.com/" target="_blank" rel="noopener noreferrer">
    sfbc2k20.eco.com
  </a>
  for more information
</p>

<style>
  .header {
    position: relative;
  }
  .header :global(svg) {
    margin: 0 calc(var(--page-gutter-horiz) * -1);
    width: calc(100% + var(--page-gutter-horiz) * 2);
    height: auto;
  }
  h1 {
    color: var(--blue);
    font-size: 36px;
    line-height: 54px;
    font-weight: bold;
    position: absolute;
    left: 0;
    top: 65px;
  }
  p {
    font-size: 14px;
    line-height: 21px;
    font-weight: normal;
  }
  .points-scheme {
    font-weight: bold;
  }
  .points-scheme li {
    padding: 0.5em 0 0.5em 50px;
    text-indent: -50px;
  }
  .points-scheme li :global(svg) {
    height: 2em;
    margin-right: 0.5em;
  }
</style>

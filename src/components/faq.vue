<template>
  <div id="faq">
    <v-github-ribbon/>
    <router-link to="/">&laquo; back</router-link>
    <dl>
      <dt>Why, oh why?</dt>
      <dd>
        This tool helps to debug problems related to pointing devices such as
        mice and eye trackers, and their drivers. Users can easily share their
        recordings with each other and device driver authors, without having
        to use screencast software.
      </dd>

      <dt>Why 21?</dt>
      <dd>
        This tools measures the clicking paths between each corner
        (actually, near-corner) of the screen and the center. It takes
        21 clicks to traverse all the possible paths in both directions.
      </dd>

      <dt>Is this a reaction test?</dt>
      <dd>
        No. The order of the rectangles is not random, and the recording only
        starts after the first click.
      </dd>

      <dt>How about touch devices?</dt>
      <dd>
        The test tracks cursor movement and clicks. While touch (only) devices
        don't have a cursor, one can test e.g. finger reach.
      </dd>

      <dt>Are test results comparable?</dt>
      <dd>
        To some extent, I believe. Each run contains the same moves.
      </dd>

      <dt>What about my privacy? You are tracking my every move!</dt>
      <dd>
        I'm not! Only your browser is. The recording is only sent to a server
        (Firebase) if you choose 'Share Link'. Otherwise everything happens in
        the comfort of your own browser.
      </dd>

      <dt>I found a bug.</dt>
      <dd>
        That's unfortunate. I hope you take the time to
        <a href="https://github.com/tuomassalo/21clicks/issues/new">report
        it</a>.
      </dd>

      <dt>I found a way to cheat.</dt>
      <dd>
        Cool.
      </dd>

      <dt>I'd like to see some fancy stats.</dt>
      <dd>
        That's great! You can download the data in the json file, in a
        relatively simple format: each element of the <tt>moves</tt> array has
        these elements:
        <ul>
          <li>timestamp</li>
          <li>pointer x coordinate (pixels)</li>
          <li>pointer y coordinate (pixels)</li>
          <li>possibly one of these:
            <ul>
              <li>
                <tt>{type: 'drawTarget', x, y, size, number}</tt> –
                coordinates, size and the visible number of the next rectangle
                (indicating a successful click)
              </li>
              <li>
                <tt>{type: 'click'}</tt>, indicating a successful click
              </li>
              <li>
                <tt>{type: 'misclick'}</tt>, indicating a misclick
              </li>
            </ul>
          </li>
        </ul>
        Pull requests are welcome.
      </dd>

    </dl>
  </div>
</template>
<script>
import VGithubRibbon from './github-ribbon'
export default {
  props: ['targetCount'],
  components: {
    VGithubRibbon,
  },
}
</script>
<style>
  #faq {
    padding: 30px;
    height: 100%;
    overflow: auto;
  }
  #faq dl {
    max-width: 700px;
    margin: auto;
    margin-bottom: 50px;
  }
  #faq dt {
    margin-top: 1em;
    font-size: 150%;
    border-bottom: 1px solid black;
  }
</style>

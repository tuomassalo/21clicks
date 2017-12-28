<template>
  <router-view
    :targetCount="targetCount"
    :recording="recording"
  />
</template>

<script>
import initTargets from './init-targets'
import constants from './constants'

const STATES = {
  EMPTY: 'EMPTY',
  HELLO: 'HELLO',
  RECORDING: 'RECORDING',
  ABORTED: 'ABORTED',
  DONE: 'DONE',
  REPLAYING: 'REPLAYING',
  FAQ: 'FAQ',
}

export default {
  data() {
    return {
      STATES,
      startTime: null,
      state: STATES.EMPTY,
      recording: null,
      targets: null, // list of rectangle dimensions
      target: null,
      // targetSize: TARGET_SIZES.SMALL,
      targetCount: null,
      clickedTargetCount: null,
      replayCursor: null,
      replayClickIndicators: [],
      replayScale: 1,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      recorder: null, // timer id
    }
  },
  created() {
    this.$on(constants.events.UPDATE_RECORDING, recording => {
      this.recording = recording
    })
  },
  methods: {
    goToFaq() {
      this.state = STATES.FAQ
    },
    goToHello() {
      this.state = STATES.HELLO
      this.target = null
      this.targets = initTargets() // to count the number of targets to come
      this.targetCount = this.targets.length
    },
  },
  mounted() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.$emit(constants.events.KEY_ESC)
        // esc should stop recording and replaying
        // if (this.state === STATES.RECORDING) {
        //   this.stopRecording()
        // } else if (this.state === STATES.REPLAYING) {
        //   this.state = STATES.DONE
        // }
      } else if (e.keyCode === 83) {
        // for testing: skip the rectangles by pressing 's'
        this.$emit(constants.events.KEY_S)
        // this.clickTarget()
      }
    })

    // window.addEventListener('click', () => {
    //   if (this.state === STATES.RECORDING) {
    //     // record misclicks
    //     moves.push([performance.now(), currentX, currentY, {misclick: true}])
    //   } else if (this.state === STATES.REPLAYING) {
    //     this.state = STATES.DONE
    //   }
    // })
    //
    window.addEventListener('resize', () => {
      this.$emit(constants.events.RESIZE)
      // if (this.state === STATES.REPLAYING) {
      //   this.updateReplayScale()
      // } else if (this.state === STATES.RECORDING) {
      //   this.stopRecording()
      // }
    })
    // setTimeout(() => this.goToHello(), 100)
  },
}
</script>

<style>
  /*@import url('https://fonts.googleapis.com/css?family=Noto+Sans');*/

  * {
    box-sizing: border-box;
    color: #555;
    font-family: 'Noto Sans', sans-serif;
  }
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    line-height: 1.9;
  }
  a {
    color: #E56000;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  #dropzone {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    border: 12px dashed #8f8;
  }
  body > div {
    height: 100%;
  }
  div.message {
    padding: 30px;
    font-size: 2.4vw;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }
  tt {
    font-family: 'Source Code Pro', monospace;
    background: rgba(0, 0, 0, .05);
    padding: 5px;
  }
  button {
    padding: 1.8vw 2vw;
    margin: 1vw 1vw;
    background: #E56000;
    color: white;
    border: 3px solid white;
    border-radius: 8px;
    font-size: 2vw;
  }
  button:hover, button:focus, button:active {
    outline: none;
    border-color: rgba(255, 255, 255,.5);
  }
  input {
    display: none;
  }

  #drop {
    font-size: 50px;
    padding: 30px;
    width: 100%;
    text-align: center;
    margin: auto;
    position: absolute;
    top: 50%;
    color: white;
  }
</style>

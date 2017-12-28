<template>
  <router-view :recording="recording"/>
</template>

<script>
import constants from './constants'

export default {
  data() {
    return {
      recording: null,
    }
  },
  created() {
    this.$on(constants.events.UPDATE_RECORDING, recording => {
      this.recording = recording
    })
  },
  mounted() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.$emit(constants.events.KEY_ESC)
        // }
      } else if (e.keyCode === 83) {
        // for testing: skip the rectangles by pressing 's'
        this.$emit(constants.events.KEY_S)
      }
    })

    window.addEventListener('resize', () => {
      this.$emit(constants.events.RESIZE)
      // if (this.state === STATES.REPLAYING) {
      //   this.updateReplayScale()
      // } else if (this.state === STATES.RECORDING) {
      //   this.stopRecording()
      // }
    })
  },
}
</script>

<style>
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
</style>

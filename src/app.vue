<template>
  <div class="full">
  <VueFullScreenFileDrop @drop='onDrop'>
    <div id="drop">Drop a recording.json here.</div>
  </VueFullScreenFileDrop>
  <router-view :recording="recording"/>
  </div>
</template>

<script>
import VueFullScreenFileDrop from 'vue-full-screen-file-drop'
import 'vue-full-screen-file-drop/dist/vue-full-screen-file-drop.css'
import constants from './constants'
import utils from './utils'

export default {
  data() {
    return {
      recording: null,
    }
  },
  components: {
    VueFullScreenFileDrop,
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
  methods: {
    // called by VueFullScreenFileDrop
    onDrop(formData, files) {
      utils.handleUpload(files, contents => {
        this.recording = contents
        this.$router.push('/stats')
      })
    },
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
    color: rgb(229, 96, 0);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  body > div, div.full {
    height: 100%;
  }
  div.message {
    padding: 30px;
    font-size: 2.4vw;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  tt {
    font-family: 'Source Code Pro', monospace;
    background: rgba(0, 0, 0, .05);
    padding: 5px;
  }
  button {
    padding: 1.8vw 2vw;
    margin: 1vw 1vw;
    background: rgb(229, 96, 0);
    color: white;
    border: 3px solid white;
    border-radius: 8px;
    font-size: 2vw;
  }
  button:hover, button:focus, button:active {
    outline: none;
    border-color: rgba(255, 255, 255,.5);
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

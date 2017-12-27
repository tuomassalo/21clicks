<template>
  <div>
    <VueFullScreenFileDrop @drop='onDrop'>
      <div id="drop">Drop a recording.json here.</div>
    </VueFullScreenFileDrop>
    <div class="message" v-if="state === STATES.HELLO">
      Test your pointing device skills and equipment by clicking through {{targetCount}} rectangles.
      <br>
      Then download and share the resulting recording.
      <br>
      <button @click.stop="start(TARGET_SIZES.LARGE)">Easy</button>
      <button @click.stop="start(TARGET_SIZES.MEDIUM)">Medium</button>
      <button @click.stop="start(TARGET_SIZES.SMALL)">Hard</button>
      <br>
      Or, <a href="#" @click.prevent="activateFileInput">upload</a> or drop a recording.json file here to replay a recording.
      <input type="file" ref="file" @change="fileChosen">
    </div>
    <div class="message" v-if="state === STATES.ABORTED">
      Timeout. Recording aborted.
      <br>
      <button @click.stop="goToHello">
        OK
      </button>
    </div>
    <div class="message" v-if="state === STATES.DONE">
      Clicked through {{recording.targetCount}} rectangles in {{recording.elapsedTime/1000}} s.
      <br>
      <button @click.stop="goToHello">
        Start again
      </button>
      <button @click.stop="replay">
        Replay
      </button>
      <button @click.stop="download">
        Download recording
      </button>
    </div>
    <div
      id="playground"
      v-if="target && (state === STATES.RECORDING || state === STATES.REPLAYING)"
      :class="state"
      :style="state === STATES.REPLAYING ? {
        width: recording.env.windowWidth + 'px',
        height: recording.env.windowHeight + 'px',
        transform: `scale(${replayScale})`,
      } : {}">
      <div
        id="target"
        v-if="target && (state === STATES.RECORDING || state === STATES.REPLAYING)"
        :style="{
          width: target.size + 'px',
          height: target.size + 'px',
          left: target.x - target.size / 2 + 'px',
          top: target.y - target.size / 2 + 'px',
        }"
        @click.stop="clickTarget"
      ></div>
      <div id="replayCursor" v-if="replayCursor && (state === STATES.RECORDING || state === STATES.REPLAYING)" :style="{
        left: replayCursor.x - 5 + 'px',
        top: replayCursor.y - 5 + 'px',
      }"></div>
      <transition-group name="fadeout" tag="div">
        <div class="replayClickIndicator" :class="[i.misclick ? 'misclick' : '']" v-for="i of replayClickIndicators" :key="i.id" :style="{
          left: i.x - 5 + 'px',
          top: i.y - 5 + 'px',
        }"></div>
    </transition-group>
    </div>
    <a v-if="state === STATES.HELLO" href="https://github.com/tuomassalo/21clicks"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
  </div>
</template>

<script>
import VueFullScreenFileDrop from 'vue-full-screen-file-drop'
import 'vue-full-screen-file-drop/dist/vue-full-screen-file-drop.css'
import initTargets from './init-targets'
import fullScreen from './full-screen'
import utils from './utils'

const STATES = {
  EMPTY: 'EMPTY',
  HELLO: 'HELLO',
  RECORDING: 'RECORDING',
  ABORTED: 'ABORTED',
  DONE: 'DONE',
  REPLAYING: 'REPLAYING',
}
const TARGET_SIZES = {
  SMALL: 16,
  MEDIUM: 32,
  LARGE: 64,
}

const options = {
  samplingInterval: 10, // milliseconds
  maxMoves: 10000, // 100 seconds
}
let currentX, currentY, moves

export default {
  data() {
    return {
      STATES,
      TARGET_SIZES,
      startTime: null,
      state: STATES.EMPTY,
      recording: {},
      targets: null, // list of rectangle dimensions
      target: null,
      targetSize: TARGET_SIZES.SMALL,
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
  components: {
    VueFullScreenFileDrop,
  },
  methods: {
    activateFileInput() {
      this.$refs.file.click()
    },
    fileChosen() {
      this.onDrop(null, this.$refs.file.files)
    },
    onDrop(formData, files) {
      utils.handleUpload(files, contents => {
        this.recording = contents
        this.state = STATES.DONE
      })
    },
    start(targetSize) {
      this.state = STATES.EMPTY

      setTimeout(() => {
        fullScreen.start()

        this.targetSize = targetSize

        setTimeout(() => {
          this.target = null
          this.state = STATES.RECORDING

          this.windowWidth = window.innerWidth
          this.windowHeight = window.innerHeight
          this.targets = initTargets(this.windowWidth, this.windowHeight, targetSize)
          this.clickedTargetCount = -1

          this.recording = {
            _: `recorded with <${location.href}>`,
            env: {
              recordingTime: new Date().toISOString(),
              userAgent: navigator.userAgent,
              screenWidth: screen.width,
              screenHeight: screen.height,
              windowWidth: this.windowWidth,
              windowHeight: this.windowHeight,
            },
            options,
          }
          moves = []

          const recordMouse = () => {
            if (moves.length < options.maxMoves) {
              moves.push([performance.now(), currentX, currentY])
            } else {
              clearInterval(this.recorder)
              this.state = STATES.ABORTED
              this.target = null
            }
          }

          this.recorder = setInterval(recordMouse, options.samplingInterval)
          recordMouse()
          this.startTime = +Date.now()
          this.clickTarget()
        }, 2000)
      }, 100)
    },
    drawTarget({x, y, size}) {
      x = Math.max(size, x)
      x = Math.min(this.windowWidth - size, x)
      y = Math.max(size, y)
      y = Math.min(this.windowHeight - size, y)
      this.target = {x, y, size}
      moves[moves.length - 1].push({x, y, size})
    },
    clickTarget() {
      this.clickedTargetCount++
      const nextTarget = this.targets.shift()
      if (nextTarget) {
        this.drawTarget({...nextTarget})
      } else {
        this.stopRecording()
      }
    },
    stopRecording() {
      fullScreen.end()
      clearInterval(this.recorder)
      // change timestamps to start from zero.
      const offset = moves[0][0]
      for (const m of moves) {
        m[0] = Math.round(m[0] - offset)
      }
      this.recording.moves = moves
      // console.log(moves)
      this.recording.elapsedTime = +Date.now() - this.startTime
      this.recording.targetCount = this.clickedTargetCount
      this.state = STATES.DONE
    },
    replay() {
      this.state = STATES.REPLAYING
      this.updateReplayScale()
      moves = this.recording.moves
      const handleActions = move => {
        if (move[3]) {
          if (move[3].x) {
            this.target = move[3]
          } else if (move[3].misclick) {
            // TODO: show clicks and misclicks
          }
          // console.log('click!', move, this.replayClickIndicators)
          this.replayClickIndicators.push({
            x: move[1] - 5,
            y: move[2] - 5,
            misclick: move[3].misclick,
            id: this.replayClickIndicators.length,
          })
        }
      }
      let i = 0,
        len = moves.length,
        // t0 = +Date.now(),
        offset,
        anim = timestamp => {
          const t = timestamp - offset
          // const t = (timestamp - offset) / 15
          if (moves[i][0] > t) {
            // console.log('not drawing anything', i)
            requestAnimationFrame(anim)
            return
          }
          while (moves[i + 1] && moves[i + 1][0] < timestamp - offset) {
            handleActions(moves[i])
            // console.log('skipping data!', i)
            i++
          }
          this.replayCursor = {
            x: moves[i][1] - 5,
            y: moves[i][2] - 5,
          }
          handleActions(moves[i])

          i++

          if (i === len || this.state !== STATES.REPLAYING) {
            setTimeout(() => {
              this.replayCursor = null
              this.replayClickIndicators = []
              this.target = null
              this.state = STATES.DONE
            }, 1000)
            // console.log('playback time', +Date.now() - t0)
          } else {
            requestAnimationFrame(anim)
          }
        }

      requestAnimationFrame(timestamp => {
        offset = timestamp
        requestAnimationFrame(anim)
      })
    },
    download() {
      utils.download(this.recording)
    },
    updateReplayScale() {
      this.replayScale = Math.min(
        window.innerWidth / this.recording.env.windowWidth,
        window.innerHeight / this.recording.env.windowHeight,
        1,
      )
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
        // esc should stop recording and replaying
        if (this.state === STATES.RECORDING) {
          this.stopRecording()
        } else if (this.state === STATES.REPLAYING) {
          this.state = STATES.DONE
        }
      } else if (e.keyCode === 83) {
        // for testing: skip the rectangles by pressing 's'
        this.clickTarget()
      }
    })

    window.addEventListener('click', () => {
      if (this.state === STATES.RECORDING) {
        // record misclicks
        moves.push([performance.now(), currentX, currentY, {misclick: true}])
      } else if (this.state === STATES.REPLAYING) {
        this.state = STATES.DONE
      }
    })
    window.addEventListener('mousemove', e => {
      currentX = e.pageX
      currentY = e.pageY
    })

    window.addEventListener('resize', () => {
      if (this.state === STATES.REPLAYING) {
        this.updateReplayScale()
      } else if (this.state === STATES.RECORDING) {
        this.stopRecording()
      }
    })
    setTimeout(() => this.goToHello(), 100)
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
  #playground {
    width: 100%;
    height: 100%;
    border: 3px solid rgba(0,0,0,0);
    position: relative;
    transform-origin: left top;
  }
  #playground.REPLAYING  {
    border-color: yellow;
    pointer-events: none;
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
  div#target {
    position: absolute;
    background: #88f;
  }
  div#target:hover {
    border: 3px solid blue;
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
    transform: perspective(1px) translateY(-50%);
    -webkit-transform: perspective(1px) translateY(-50%);
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
  #replayCursor {
    border-radius: 50%;
    background: black;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .replayClickIndicator {
    border-radius: 50%;
    border: 1px solid black;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(4);
    opacity: 0;
  }
  .replayClickIndicator.misclick {
    border-color: red;
    background: red;
  }

  .fadeout-enter-active {
    transition: all .3s ease;
  }
  .fadeout-leave-active {
    transition: all .8s ease;
    opacity: 0;
  }
  /*.fadeout-enter, .fadeout-leave-to {
    opacity: 1;
  }*/
  .fadeout-enter {
    opacity: 1;
  }
  .fadeout-leave-to {
    opacity: 0;
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

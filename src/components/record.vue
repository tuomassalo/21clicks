<template>
  <div id="playground-container"
    <v-playground
      :currentTarget="currentTarget"
      :nextTarget="nextTarget"
      :clickTarget="clickTarget"
      :misclick="misclick"
    />
  </div>
</template>
<script>
import VPlayground from './playground'
import screenfull from 'screenfull'
import initTargets from '../init-targets'
import constants from '../constants'

// not reactive, for performance
// let currentX, currentY, moves
let moves

const options = {
  samplingInterval: 10, // milliseconds
  maxMoves: 10000, // 100 seconds
}

const TARGET_SIZES = {
  easy: 64,
  medium: 32,
  hard: 16,
}

export default {
  data() {
    return {
      level: null,
      currentTarget: null,
      nextTarget: null,
      newRecording: null,
      targets: [],
      currentX: null,
      currentY: null,
      startTime: null,
    }
  },
  props: ['targetCount'],
  components: {
    VPlayground,
  },
  beforeRouteEnter(to, from, next) {
    // must do this synchronously, otherwise we get e.g.:
    //   "Failed to execute 'requestFullscreen' on 'Element':
    //    API can only be initiated by a user gesture.'"
    screenfull.request()

    next(vm => {
      // access to component instance via `vm`
      const targetSize = TARGET_SIZES[vm.$route.params.level]
      if (!targetSize) {
        vm.$router.push('/')
        return
      }
      vm.startRecording(targetSize)
    })
  },
  created() {
    this.onWhenActive(constants.events.RESIZE, () => {
      if (this.recorder) {
        this.stopRecording()
      }
    })
  },
  mounted() {
    window.addEventListener('mousemove', e => {
      this.currentX = e.pageX
      this.currentY = e.pageY
    })
    this.onWhenActive(constants.events.KEY_ESC, () => {
      console.log('stopRec')
      this.stopRecording()
    })
    this.onWhenActive(constants.events.KEY_C, () => {
      const ev = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: this.currentX,
        screenY: this.currentY,
      })

      const el = document.elementFromPoint(this.currentX, this.currentY)

      el.dispatchEvent(ev)
    })
    this.onWhenActive(constants.events.KEY_S, () => {
      this.clickTarget()
    })
  },
  methods: {
    startRecording(targetSize) {
      setTimeout(() => {
        setTimeout(() => {
          this.currentTarget = null

          this.windowWidth = window.innerWidth
          this.windowHeight = window.innerHeight
          this.targets = initTargets(
            this.windowWidth,
            this.windowHeight,
            targetSize,
          )

          // first click is programmatic
          this.clickedTargetCount = -1

          // don't start counting yet - only after the first click
          this.startTime = null

          this.newRecording = {
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
              moves.push([performance.now(), this.currentX, this.currentY])
            } else {
              this.stopRecording(true)
            }
          }

          this.recorder = setInterval(recordMouse, options.samplingInterval)
          recordMouse()

          // show first target
          this.clickTarget()
        }, 2000)
      }, 100)
    },
    drawTarget({x, y, size, number}) {
      this.currentTarget = {x, y, size, number}
    },
    clickTarget() {
      if (this.targets.length === 20) {
        this.startTime = +Date.now()
      }
      if (this.startTime) {
        moves.push([
          performance.now(),
          this.currentX,
          this.currentY,
          {type: 'click'},
        ])
      }
      this.clickedTargetCount++

      const newTarget = this.targets.shift()
      if (newTarget) {
        this.currentTarget = newTarget
        moves.push([
          performance.now(),
          this.currentX,
          this.currentY,
          {type: 'drawTarget', ...newTarget},
        ])
        this.nextTarget = this.targets[0]
      } else {
        this.stopRecording()
      }
    },
    misclick() {
      moves.push([
        performance.now(),
        this.currentX,
        this.currentY,
        {type: 'misclick'},
      ])
    },
    stopRecording(isTimeout) {
      screenfull.exit()
      clearInterval(this.recorder)
      this.recorder = null
      // change timestamps to start from zero.
      const offset = moves[0][0]
      for (const m of moves) {
        m[0] = Math.round(m[0] - offset)
      }
      this.newRecording.moves = moves
      // console.log(moves)
      this.newRecording.elapsedTime = +Date.now() - this.startTime
      this.newRecording.targetCount = this.clickedTargetCount
      this.$parent.$emit(constants.events.UPDATE_RECORDING, this.newRecording)
      this.$router.push('/stats' + (isTimeout ? '?timeout' : ''))
    },
  },
}
</script>
<style scoped>
#playground-container {
  height: 100%;
}
</style>

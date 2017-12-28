<template>
  <div id="playground-container"
    <v-playground
      :target="target"
      :clickTarget="clickTarget"
      :misclick="misclick"
    />
  </div>
</template>
<script>
import VPlayground from './playground'
import fullScreen from '../full-screen'
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
      target: null,
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
  mounted() {
    window.addEventListener('mousemove', e => {
      this.currentX = e.pageX
      this.currentY = e.pageY
    })
    this.$parent.$on(constants.events.KEY_ESC, () => {
      this.stopRecording()
    })
    this.$parent.$on(constants.events.KEY_S, () => {
      this.clickTarget()
    })
  },
  methods: {
    startRecording(targetSize) {
      setTimeout(() => {
        // fullScreen.start()

        setTimeout(() => {
          this.target = null

          this.windowWidth = window.innerWidth
          this.windowHeight = window.innerHeight
          this.targets = initTargets(
            this.windowWidth,
            this.windowHeight,
            targetSize,
          )
          this.clickedTargetCount = -1

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
          this.startTime = +Date.now()
          this.clickTarget()
        }, 2000)
      }, 100)
    },
    drawTarget({x, y, size, number}) {
      x = Math.max(size, x)
      x = Math.min(this.windowWidth - size, x)
      y = Math.max(size, y)
      y = Math.min(this.windowHeight - size, y)
      this.target = {x, y, size, number}
      moves.push([
        performance.now(),
        this.currentX,
        this.currentY,
        {type: 'drawTarget', x, y, size, number},
      ])
    },
    clickTarget() {
      moves.push([
        performance.now(),
        this.currentX,
        this.currentY,
        {type: 'click'},
      ])
      this.clickedTargetCount++
      const nextTarget = this.targets.shift()
      if (nextTarget) {
        this.drawTarget({...nextTarget})
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
      fullScreen.end()
      clearInterval(this.recorder)
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

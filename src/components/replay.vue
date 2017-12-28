<template>
  <div id="playground-container"
    v-if="recording"
    :style="{
      width: recording.env.windowWidth + 'px',
      height: recording.env.windowHeight + 'px',
      transform: `scale(${replayScale})`,
    }">
    <v-playground
    :target="target"
    :replayCursor="replayCursor"
    :replayClickIndicators="replayClickIndicators"
    :clickTarget="stopReplay"
    :misclick="stopReplay"
    />
  </div>
</template>
<script>
import constants from '../constants'
import VPlayground from './playground'

export default {
  props: ['recording'],
  data() {
    return {
      replayCursor: null,
      replayClickIndicators: [],
      replayScale: null,
      target: null,
    }
  },
  components: {
    VPlayground,
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // access to component instance via `vm`
      vm.replay()
    })
  },
  created() {
    this.$parent.$on(constants.events.KEY_ESC, () => {
      this.stopReplay()
    })
  },
  mounted() {
    if (!this.recording) {
      this.$router.push('/')
    }
  },
  methods: {
    replay() {
      this.updateReplayScale()
      const moves = this.recording.moves
      const handleActions = move => {
        if (move[3]) {
          if (move[3].type === 'drawTarget') {
            this.target = move[3]
          } else {
            // console.log('click!', move, this.replayClickIndicators)
            this.replayClickIndicators.push({
              x: move[1] - 5,
              y: move[2] - 5,
              type: move[3].type,
              id: this.replayClickIndicators.length, // for animation
            })
          }
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

          if (i === len) {
            setTimeout(() => {
              this.$router.push('/stats')
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
    stopReplay() {
      this.$router.push('/stats')
    },
    updateReplayScale() {
      this.replayScale = Math.min(
        window.innerWidth / this.recording.env.windowWidth,
        window.innerHeight / this.recording.env.windowHeight,
        1,
      )
    },
  },
}
</script>
<style scoped>
#playground-container {
  pointer-events: none;
  transform-origin: left top;
  height: 100%;
}
#playground {
  /* HACK: break through 'scoped' here with 'important' */
  border-color: #FFFF58 !important;
}
</style>

<template>
  <div class="full">
    <v-github-ribbon/>
    <div class="message" v-if="recording">
      <div v-if="wasTimeout">
        Timeout. Recording stopped.
        <br>
      </div>
      Clicked through {{recording.targetCount}} rectangles
      in {{recording.elapsedTime/1000}} s.
      <br>
      <router-link to="/" tag="button">Start again</router-link>
      <router-link to="/replay" tag="button">Replay</router-link>
      <button @click.stop="download">Download</button>
      <button @click.stop="share">Share Link</button>
    </div>
  </div>
</template>
<script>
import utils from '../utils'
import VGithubRibbon from './github-ribbon'
import firebase from '../firebase'
import constants from '../constants'

export default {
  props: ['recording'],
  data() {
    return {
      wasTimeout: 'timeout' in this.$route.query,
    }
  },
  components: {
    VGithubRibbon,
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.recordingId) {
      firebase.load(to.params.recordingId).then(ret => {
        next(vm => {
          vm.$parent.$emit(constants.events.UPDATE_RECORDING, ret)
        })
      })
    } else {
      next(vm => {
        if (!vm.recording) {
          vm.$router.push('/')
        }
      })
    }
  },
  methods: {
    download() {
      utils.download(this.recording)
    },
    share() {
      function copy() {
        alert('Please copy and share the current url in your media of choice.')
      }

      if (!this.$route.params.recordingId) {
        firebase.save({recording: this.recording}).then(ret => {
          this.$router.push('/share/' + ret.recordingId)
          setTimeout(copy, 1000)
        })
      } else {
        copy()
      }
    },
  },
}
</script>
<style scoped>
</style>

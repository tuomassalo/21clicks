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
      <button @click.stop="download">
        Download recording
      </button>
    </div>
  </div>
</template>
<script>
import utils from '../utils'
import VGithubRibbon from './github-ribbon'

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
  mounted() {
    if (!this.recording) {
      this.$router.push('/')
    }
  },
  methods: {
    download() {
      utils.download(this.recording)
    },
  },
}
</script>
<style scoped>
</style>

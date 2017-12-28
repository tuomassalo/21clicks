<template>
  <div class="full">
    <v-github-ribbon/>
    <div class="message">
      Test your pointing device skills and equipment by clicking through
      {{targetCount}} rectangles.
      <br>
      Then download and share the resulting recording.
      <br>
      <router-link to="/record/easy" tag="button">Easy</router-link>
      <router-link to="/record/medium" tag="button">Medium</router-link>
      <router-link to="/record/hard" tag="button">Hard</router-link>
      <br>
      Or, <a href="#" @click.prevent="activateFileInput">upload</a> or
      drop a recording.json file here to replay a recording.
      <input type="file" ref="file" @change="fileChosen">
      <br><br>
      <router-link to="/faq">Why, oh why?</router-link>
    </div>
  </div>
</template>
<script>
import initTargets from '../init-targets'
import VGithubRibbon from './github-ribbon'

export default {
  data() {
    return {
      targetCount: initTargets().length,
    }
  },
  components: {
    VGithubRibbon,
  },
  methods: {
    activateFileInput() {
      this.$refs.file.click()
    },
    fileChosen() {
      this.$parent.onDrop(null, this.$refs.file.files)
    },
  },
}
</script>
<style scoped>
  input {
    display: none;
  }
</style>

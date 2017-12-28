<template>
  <div class="full">
    <VueFullScreenFileDrop @drop='onDrop'>
      <div id="drop">Drop a recording.json here.</div>
    </VueFullScreenFileDrop>
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
import VueFullScreenFileDrop from 'vue-full-screen-file-drop'
import 'vue-full-screen-file-drop/dist/vue-full-screen-file-drop.css'
import utils from '../utils'
import initTargets from '../init-targets'
import constants from '../constants'
import VGithubRibbon from './github-ribbon'

export default {
  data() {
    return {
      targetCount: initTargets().length,
    }
  },
  components: {
    VueFullScreenFileDrop,
    VGithubRibbon,
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
        this.$parent.$emit(constants.events.UPDATE_RECORDING, contents)
        this.$router.push('/stats')
      })
    },
  },
}
</script>
<style scoped>
  div.full {
    height: 100%;
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

<template>
  <div
    id="playground"
    v-if="target"
    @click.stop="misclick"
  >
    <div
      id="target"
      v-if="target"
      :style="{
        width: target.size + 'px',
        height: target.size + 'px',
        left: target.x - target.size / 2 + 'px',
        top: target.y - target.size / 2 + 'px',
      }"
      @click.stop="clickTarget"
    ><div>{{target.number}}</div></div>
    <div
      id="replayCursor"
      v-if="replayCursor"
      :style="{
        left: replayCursor.x - 5 + 'px',
        top: replayCursor.y - 5 + 'px',
      }"
    ></div>
    <transition-group name="fadeout" tag="div">
      <div
        class="replayClickIndicator"
        :class="[i.type]"
        v-for="i of replayClickIndicators"
        :key="i.id"
        :style="{
          left: i.x - 5 + 'px',
          top: i.y - 5 + 'px',
        }"
      ></div>
  </transition-group>
  </div>
</template>
<script>
export default {
  props: [
    'target',
    'replayCursor',
    'replayClickIndicators',
    'clickTarget',
    'misclick',
  ],
}
</script>
<style scoped>
#playground {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(0,0,0,0);
  position: relative;
  transform-origin: left top;
}
div#target {
  position: absolute;
  background: #E56000;
  cursor: pointer;
}
div#target div {
  margin: auto;
  text-align: center;
  color: white;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
div#target:hover {
  /*border: 3px solid rgba(255, 255, 255, .3);*/
  outline: 3px solid #E5600088;
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
</style>

<template>
  <div
    id="playground"
    v-if="currentTarget"
    @click.stop="misclick"
  >
  <div
    class="target"
    id="currentTarget"
    v-if="currentTarget"
    :style="{
      width: currentTarget.size + 'px',
      height: currentTarget.size + 'px',
      left: currentTarget.x - currentTarget.size / 2 + 'px',
      top: currentTarget.y - currentTarget.size / 2 + 'px',
    }"
    @click.stop="clickTarget"
  ><div>{{currentTarget.number}}</div></div>
  <div
    class="target"
    id="nextTarget"
    v-if="nextTarget"
    :style="{
      width: nextTarget.size + 'px',
      height: nextTarget.size + 'px',
      left: nextTarget.x - nextTarget.size / 2 + 'px',
      top: nextTarget.y - nextTarget.size / 2 + 'px',
    }"
  ><div>{{nextTarget.number}}</div></div>
    <div
      id="replayCursor"
      v-if="replayCursor"
      :style="{
        left: replayCursor.x - 7.5 + 'px',
        top: replayCursor.y - 7.5 + 'px',
      }"
    ></div>
    <transition-group name="fadeout" tag="div">
      <div
        class="replayClickIndicator"
        :class="[i.type]"
        v-for="i of replayClickIndicators"
        :key="i.id"
        :style="{
          left: i.x - 17.5 + 'px',
          top: i.y - 17.5 + 'px',
        }"
      ></div>
  </transition-group>
  </div>
</template>
<script>
export default {
  props: [
    'currentTarget',
    'nextTarget',
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
div.target {
  position: absolute;
}
div#currentTarget {
  background: rgb(229, 96, 0);
  cursor: pointer;
}
div.target div {
  margin: auto;
  text-align: center;
  color: white;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
div#currentTarget:hover {
  outline: 3px solid rgba(229, 96, 0, .5);
}
div#nextTarget {
    background: #ddd;
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
  border: 4px solid black;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  /*transform: scale(4);
  transform-origin: center center;*/
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

<template>
  <div class="video-poster">
    <img :src="videoPoster" :width="width" :height="height" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    videoSrc: String,
    width: {
      type: String,
      default: "200",
    },
    height: {
      type: String,
      default: "150",
    },
  },
  data() {
    return {
      videoPoster: null,
    };
  },
  mounted() {
    this.getVideoPoster();
  },
  methods: {
    getVideoPoster() {
      var scale = 0.8;
      const video = document.createElement("video");
      video.width = this.width;
      video.height = this.height;
      video.src = this.videoSrc;
      video.setAttribute("crossOrigin", "Anonymous");
      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = this.width * 0.8;
        canvas.height = this.height * 0.8;
        canvas.getContext("2d").drawImage(video, 0, 0, this.width, this.height);
        const imgSrc = canvas.toDataURL("image/png");
        document.removeChild(video);
        document.removeChild(canvas);
        this.videoPoster = imgSrc;
      });
    },
  },
};
</script>

<style>
</style>
<template>
  <div id="app">
    <Navbar v-if="user" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/layout/Navbar";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
};
</script>

<style >
#app {
  padding-bottom: 100px;
}
</style>

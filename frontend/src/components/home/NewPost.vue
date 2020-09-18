<template>
  <!--Creat a new post-->
  <div class="card bg-light mb-3">
    <h5 class="card-header">
      <img class="avatar" v-bind:src="avatar" />
      {{ username }}
    </h5>
    <div class="card-body post-input">
      <input
        type="textarea"
        class="text"
        v-model="newPost.title"
        id="input-title"
        rows="10"
        cols="30"
        placeholder="Add a title..."
      />
      <textarea class="form-control" v-model="newPost.text" placeholder="Add content" rows="3"></textarea>
      <div v-if="message" class="alert alert-danger">{{ message }}</div>
    </div>
    <button type="button" class="btn btn-info post-btn" @click="creatPost">Post</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "NewPost",
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user")).data.name,
      avatar: JSON.parse(localStorage.getItem("user")).data.avatar,
      currentUserId: JSON.parse(localStorage.getItem("user")).data.id,
      newPost: {
        title: "",
        text: "",
      },
      message: "",
    };
  },
  methods: {
    creatPost(newPost) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      if (newPost.title == "") {
        this.message = "Please add a title";
      }
      if (newPost.text == "") {
        this.message = "Please add a text";
      }
      axios
        .post(
          "http://localhost:5000/api/posts/new",
          {
            title: this.newPost.title,
            text: this.newPost.text,
            UserId: this.currentUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
        .then((data) => {
          console.log("creat message", data);
          this.message === "";
          this.$router.push("/home");
        })
        .catch(() => {
          console.log("le message n'a pas été envoyé");
        });

      console.log("post btn");
    },
  },
};
</script>
<style scoped>
.card-header img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.card {
  max-width: 600px;
  margin: 100px auto;
}
</style>

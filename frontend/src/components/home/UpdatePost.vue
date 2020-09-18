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
        v-model="editedPost.title"
        id="input-title"
        rows="10"
        cols="30"
        placeholder="Add a title..."
      />
      <textarea class="form-control" v-model="editedPost.text" placeholder="add content" rows="3"></textarea>
      <div v-if="message" class="alert alert-danger">{{ message }}</div>
    </div>
    <button type="button" class="btn btn-info post-btn" @click="editPost">Edit</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "UpdatePost",
  data() {
    return {
      username: JSON.parse(localStorage.getItem("user")).data.name,
      avatar: JSON.parse(localStorage.getItem("user")).data.avatar,
      currentUserId: JSON.parse(localStorage.getItem("user")).data.id,
      editedPost: {
        title: "",
        text: "",
      },
      message: "",
    };
  },
  methods: {
    editPost() {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      if (this.editedPost.title == "" || this.editedPost.text == "") {
        this.message = "Please add a title and content";
      } else {
        axios
          .put(
            `http://localhost:5000/api/posts/${this.$route.params.post_id}`,
            {
              title: this.editedPost.title,
              text: this.editedPost.text,
              UserId: this.currentUserId,
            },
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          )
          .then((data) => {
            console.log("apdate post", data);
            this.message === "";
            this.$router.push("/home");
          })
          .catch(() => {
            console.log("le message n'a pas été envoyé");
          });
      }
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

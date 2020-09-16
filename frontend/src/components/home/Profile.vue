<template>
  <div class="profile">
    <h1>User profile</h1>
    <div class="card profile-card">
      <a class="deleteProfile" @click="deleteUser">
        <i class="fas fa-times fa-sm"></i>
      </a>
      <img v-bind:src="user.avatar" />
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="card-text">{{ user.email }}</p>
        <a class="btn btn-primary" @click="showUpdateInput">Modify profile</a>
      </div>
    </div>
    <div v-if="updateBtn" class="card-body user-input">
      <input
        type="textarea"
        class="text"
        v-model="editedUser.username"
        id="input-title"
        rows="10"
        cols="30"
        placeholder="username"
      />
      <input
        type="textarea"
        class="text"
        v-model="editedUser.email"
        id="input-title"
        rows="10"
        cols="30"
        placeholder="email"
      />
      <div v-if="message" class="alert alert-danger">{{ message }}</div>
      <button type="button" class="btn btn-info post-btn" @click="editUser">Confirm</button>
      <button type="button" class="btn btn-info post-btn" @click="hideUpdateInput">Cancel</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Profile",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")).data,
      updateBtn: false,
      editedUser: {
        username: "",
        email: "",
      },
      message: "",
    };
  },
  methods: {
    showUpdateInput() {
      return (this.updateBtn = true);
    },
    hideUpdateInput() {
      return (this.updateBtn = false);
    },

    editUser() {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      if (this.editedUser.username == null) {
        this.editedUser.username = userData.data.username;
      }
      if (this.editedUser.email == null) {
        this.editedUser.email = userData.data.email;
      }
      axios
        .put(
          `http://localhost:5000/api/auth/users/${userData.data.id}`,
          {
            username: this.editedUser.username,
            email: this.editedUser.email,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          console.log("apdate user", data);
          this.message === "";
          // this.updateBtn= true,
          // localStorage.setItem("user", JSON.stringify(data));
          // this.$router.push("/home");
        })
        .catch(() => {
          console.log("le message n'a pas été envoyé");
        });
    },
    deleteUser() {
      axios
        .delete(`http://localhost:5000/api/auth/users/${this.user.id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then(() => {
          console.log("user deleted");
        })
        .catch(() => {
          console.log("Cannot delete User!");
        });
      localStorage.removeItem("user");
      this.user = "";
      this.$router.push("/");
      window.location.reload();
    },
  },
};
</script>
<style scoped>
h1 {
  text-align: center;
  margin-top: 50px;
}
.card {
  margin: 50px auto;
  width: 400px;
  text-align: center;
}
img {
  margin: 10px auto;
  border-radius: 4px;
  padding: 5px;
  width: 250px;
}
.deleteProfile {
  color: #cd201f;

  width: 17px;
  margin-left: 93%;
  margin-top: 10px;
}
</style>

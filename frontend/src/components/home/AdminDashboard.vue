<template>
  <div class="admin">
    <div class="admin-title">
      <img src="../admin.png" alt />
      <h2>Admin dashboard</h2>
    </div>
    <div class="table-heading">
      <i class="fas fa-users fa-2x"></i>
      <h3>All users</h3>
    </div>
    <div class="table-body">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">name</th>
            <th scope="col">email</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>

        <tbody class="table-users">
          <tr v-for="user in users" :key="user.id">
            <th scope="row">{{ user.id }}</th>
            <td>{{ user.name}}</td>
            <td>{{ user.email }}</td>
            <td>
              <a class="nav-link trash" @click="deleteUser(user.id)">
                <i class="fas fa-user-times fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-heading">
      <i class="fas fa-newspaper fa-2x"></i>
      <h3>All posts</h3>
    </div>
    <div class="table-body">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">title</th>
            <th scope="col">text</th>
            <th scope="col">author</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <th scope="row">{{ post.id }}</th>
            <td>{{ post.title}}</td>
            <td>{{ post.text }}</td>
            <td>{{ post.users.name }}</td>
            <td>
              <a class="nav-link trash" @click="deletePost(post.id)">
                <i class="fas fa-trash-alt fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Swal from "sweetalert2";
let moment = require("moment");

export default {
  name: "AdminDashboard",
  data() {
    return {
      users: [],
      posts: [],
    };
  },
  methods: {
    deleteUser(userId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      Swal.fire({
        title: "Are you sure you want to delete user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/api/auth/users/${userId}`, {
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
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("canceled");
        }
      });
    },
    deletePost(postId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      Swal.fire({
        title: "Are you sure you want to delete this post?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/api/posts/${postId}`, {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
            .then(() => {
              console.log("Post deleted");
            })
            .catch(() => {
              console.log("Cannot delete post !");
            });
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("canceled");
        }
      });
    },
  },
  beforeCreate() {
    let userData = JSON.parse(localStorage.getItem("user"));
    let token = userData.token;
    //get all users
    axios
      .get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.users = response.data);
      })
      .catch((err) => console.log(err));

    //get all posts
    axios
      .get("http://localhost:5000/api/posts/", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.posts = response.data);
      })
      .catch((err) => console.log(err));
    //get all comment
    axios
      .get(`http://localhost:5000/api/comments/`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.comments = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
  },
};
</script>
<style  scoped>
.table-heading {
  display: flex;
  justify-content: center;
  padding: 15px;
  margin: 20px;
  color: #fbc02d;
}
.table-heading h3 {
  margin-left: 10px;
}
.admin-title {
  display: flex;
  justify-content: center;
  padding: 15px;
  margin-top: 30px;
  color: #0288d1;
}
.admin-title h2 {
  margin-top: 15px;
  margin-left: 10px;
}
.admin-title img {
  width: 70px;
  height: 70px;
}
.fas {
  cursor: pointer;
}
.table-body {
  height: 300px;
  overflow-y: scroll;
}
.admin {
  max-width: 800px;
  margin: auto;
  padding-bottom: 100px;
}
</style>

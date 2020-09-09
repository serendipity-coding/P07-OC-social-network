<template>
  <div class="blogs container">
    <div class="heading">
      <h2>Latest posts</h2>
      <!--add new post-->
      <div class=" new-post">
        <router-link to="/newpost"
          ><img src="../notepad.png" class="add-post-logo" alt="" />
          <p>Add post</p></router-link
        >
      </div>
    </div>
    <!--all posts-->
    <div v-for="post in posts" :key="post.id">
      <div class="card">
        <h5 class="card-header">
          <div class="card-header-title">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="date">{{ moment(post.createdAt).fromNow() }}</p>
          </div>
          <div class="card-header-user">
            {{ post.users.name }}
            <img class="avatar" v-bind:src="post.users.avatar" />
          </div>
        </h5>

        <div class="card-body">
          <p class="card-text">{{ post.text }}</p>
          <div class="post-react">
            <router-link
              :to="{ name: 'ViewPost', params: { post_id: post.id } }"
            >
              <span class="comment-nbr"
                ><i class="fas fa-comment fa-lg"></i> 3</span
              >
            </router-link>
          </div>
          <div class="comment">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Add a comment ..."
                aria-describedby="button-addon2"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-primary"
                  type="button"
                  id="button-addon2"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
          <div class="postCtrl">
            <a
              class="nav-link trash"
              v-if="currentUserId == post.UserId || user.isAdmin"
              href
              @click.prevent="deletePost(post.id)"
            >
              <i class="fas fa-trash-alt fa-2x "></i>
            </a>
            <a
              class="nav-link "
              v-if="currentUserId == post.UserId"
              href
              @click.prevent="editPost"
            >
              <i class="far fa-edit fa-2x"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

let moment = require("moment");
moment.locale("fr");

export default {
  name: "Home",
  data() {
    return {
      moment: moment,
      user: JSON.parse(localStorage.getItem("user")).data,
      currentUserId: JSON.parse(localStorage.getItem("user")).data.id,
      message: "",
      posts: []
    };
  },
  methods: {
    deletePost(postId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      axios
        .delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => {
          console.log("message supprimé");
        })
        .catch(() => {
          console.log("le message n'a pas été supprimé !");
        });
      console.log("post deleted");
    },
    editPost() {
      console.log("post updated");
    }
  },

  beforeCreate() {
    //get all posts
    let userData = JSON.parse(localStorage.getItem("user"));
    let user = userData.data;

    axios
      .get(
        "http://localhost:5000/api/posts/"
        // , {
        //   headers: {
        //     Authorization: `Bearer${user.token}`
        //   }
        // }
      )
      .then(response => {
        console.log(response.data);
        return (this.posts = response.data);
      })
      .catch(err => console.log(err));
  }
};
</script>

<style>
.post-react i {
  margin-left: 15px;
  margin-bottom: 10px;
}

.card-header-user {
  margin-top: 4px;
}
.card-header-title {
  margin-top: 8px;
}
.date {
  font-size: 0.7rem;
  margin-bottom: 0;
  margin-left: 5px;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.add-post-logo {
  display: block;
  margin: 0 auto;
  width: 40px;
  height: 40px;
}
.heading {
  display: flex;
  justify-content: space-between;
}
.new-post {
  width: 70px;
}

.avatar {
  width: 50px;
  border-radius: 50%;
}
.blogs {
  max-width: 600px;
  margin: 20px auto;
}
#button-addon2 {
  font-weight: 600;
}
#input-title {
  margin: 10px auto;
}
.post-btn {
  width: 150px;
  display: block;
  margin: 10px auto;
}
.card {
  margin: 20px auto;
  background-color: #e0e0e0;
  border-radius: 30px;
}

.postCtrl {
  display: flex;
  justify-content: space-between;
}
.trash {
  color: rgb(212, 9, 9);
}
</style>

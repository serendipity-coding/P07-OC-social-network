<template>
  <div class="blogs container">
    <div class="heading">
      <h2>Latest posts</h2>
      <!--add new post-->
      <div class="new-post">
        <router-link to="/newpost">
          <img src="../notepad.png" class="add-post-logo" alt />
          <p>Add post</p>
        </router-link>
      </div>
    </div>
    <!--search in posts-->
    <input type="text" v-model="searchTerm" placeholder="Search Posts" class="search-input" />

    <!--all posts-->
    <div v-for="post in filteredPosts" :key="post.id">
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
          <div v-if=" commentCount(post.id).length > 0">
            <p>{{ getLastComment(post.id) }}</p>
          </div>
          <div class="post-react">
            <router-link :to="{ name: 'ViewPost', params: { post_id: post.id } }">
              <span class="comment-nbr">
                {{ commentCount(post.id).length }}
                <i class="fas fa-comment fa-lg"></i>
              </span>
            </router-link>
          </div>
          <div class="comment">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                v-model="commentContent"
                placeholder="Add a comment ..."
                aria-describedby="button-addon2"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-primary"
                  type="button"
                  id="button-addon2"
                  @click="addComment(post.id)"
                >Comment {{post.id}}</button>
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
              <i class="fas fa-trash-alt fa-2x"></i>
            </a>
            <router-link :to="{ name: 'UpdatePost', params: { post_id: post.id } }">
              <i class="far fa-edit fa-2x" v-if="currentUserId == post.UserId"></i>
            </router-link>
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
      userToken: JSON.parse(localStorage.getItem("user")),
      currentUserId: JSON.parse(localStorage.getItem("user")).data.id,
      message: "",
      commentContent: "",
      posts: [],
      comments: [],
      searchTerm: "",
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
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          console.log("message supprimé");
        })
        .catch(() => {
          console.log("le message n'a pas été supprimé !");
        });
    },
    editPost() {
      console.log("post updated");
    },
    addComment(id) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      axios
        .post(
          `http://localhost:5000/api/comments/${id}/new`,
          {
            content: this.commentContent,
            UserId: this.currentUserId,
          }
          // ,
          // {
          //   headers: {
          //     Authorization: `Bearer${token}`,
          //   },
          // }
        )
        .then((response) => {
          console.log("add comment", response.data);
        })
        .catch((err) => {
          console.log(err.response.data.errors[0].msg);
          this.message = "incorrect credentiels";
        });
      window.location.reload();
    },
    commentCount(id) {
      const count = this.comments.filter((comment) => comment.PostId == id);
      return count;
    },
    getLastComment(postId) {
      axios
        .get(
          `http://localhost:5000/api/comments/${postId}`
          //   ,
          //   {
          //     headers: {
          //       Authorization: `Bearer${userData.token}`
          //     }
          //   }
        )
        .then((response) => {
          let lastComment = "";
          console.log("last comment", response.data[0].content);
          lastComment = response.data[0].content;
          return lastComment;
        })
        .catch((err) => {
          console.log(err.response.data.errors[0].msg);
        });
    },
  },
  //filter post
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => {
        return post.title.match(this.searchTerm);
      });
    },
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
      .then((response) => {
        return (this.posts = response.data);
      })
      .catch((err) => console.log(err));
    //get all comment
    axios
      .get(
        `http://localhost:5000/api/comments/`
        //   ,
        //   {
        //     headers: {
        //       Authorization: `Bearer${userData.token}`
        //     }
        //   }
      )
      .then((response) => {
        console.log(response.data);
        return (this.comments = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
  },
};
</script>

<style>
.search-input {
  display: block;
  width: 80%;
  padding: 5px;
  margin: auto;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

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
  background-color: #eeeeee;
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

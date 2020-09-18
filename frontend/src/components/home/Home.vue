<template>
  <div class="blogs container">
    <div class="wall">
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
          <div class="postCtrl">
            <a
              class="nav-link trash"
              v-if="currentUserId == post.UserId || user.isAdmin"
              href
              @click.prevent="deletePost(post.id)"
            >
              <i class="fas fa-trash-alt fa-lg"></i>
            </a>
            <router-link :to="{ name: 'UpdatePost', params: { post_id: post.id } }">
              <i class="far fa-edit fa-lg" v-if="currentUserId == post.UserId"></i>
            </router-link>
          </div>
          <div class="card-body">
            <p class="card-text">{{ post.text }}</p>
            <router-link :to="{ name: 'ViewPost', params: { post_id: post.id } }">
              <i class="fas fa-comment fa-2x"></i>
            </router-link>
            <div class="commentCtrl d-flex flex-column">
              <a
                @click="displayComment"
                class="comment-nbr container-fluid"
              >{{ commentCount(post.id).length }} comments</a>
              <div class="commentList" v-if="commentCount(post.id).length > 0">
                <!-- <div v-if="commentIsDisplayed && commentCount(post.id).length > 0"> -->
                <div v-for="comment in comments" :key="comment.id">
                  <div class="comment-content container-fluid" v-if="comment.PostId == post.id ">
                    <div class="comment-content__avatar">
                      <img class="avatar" v-bind:src="comment.users.avatar" />
                    </div>
                    <div class="comment-content__text">
                      <strong>{{comment.users.name}}</strong>
                      <p>{{comment.content}}</p>
                      <a
                        class="nav-link trash"
                        v-if="currentUserId == comment.UserId || user.isAdmin"
                        href
                        @click.prevent="deleteComment(comment.id)"
                      >
                        <i class="fas fa-trash-alt fa-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="post-react">
              <!-- <router-link :to="{ name: 'ViewPost', params: { post_id: post.id } }"> -->

              <!-- </router-link> -->
            </div>
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
      commentContent: "",
      posts: [],
      comments: [],
      searchTerm: "",
      // commentIsDisplayed: false,
    };
  },
  methods: {
    displayComment(e) {
      let x = e.target.nextElementSibling;
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    },
    deletePost(postId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      axios
        .delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then(() => {
          console.log("post deleted");
        })
        .catch(() => {
          console.log("couldn't delete post");
        });
      window.location.reload();
    },
    deleteComment(commentId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      axios
        .delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then(() => {
          console.log("comment deleted");
        })
        .catch(() => {
          console.log("couldn't delete comment");
        });
      window.location.reload();
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
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
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
        .get(`http://localhost:5000/api/comments/${postId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((response) => {
          // console.log("last comment", response.data[0].content);
          this.lastComment = response.data[0].content;
          document.querySelector(".lastComment-text").innerHTML =
            response.data[0].content;
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
    console.log(JSON.parse(localStorage.getItem("user")).token);
    axios
      .get("http://localhost:5000/api/posts/", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        console.log("posts", response.data);
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
        console.log("comments", response.data);
        return (this.comments = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
  },
};
</script>

<style >
.commentList {
  display: none;
}
.commentCtrl a {
  margin-left: 80%;
  padding-top: 0;
  margin-top: 0;
}
@media screen and (min-width: 320px) and (max-width: 500px) {
  .commentCtrl a {
    margin-left: 60%;
  }
  .postCtrl {
    display: flex;
    margin-left: 0 !important;
  }
}

.comment-content {
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  /* width: 500px; */
}
.comment-content__avatar img {
  width: 35px;
  height: 35px;
  border: #0084ff 2px solid;
}
.comment-content__text {
  color: white;
  width: 650px;
  background-color: #0084ff;
  padding: 10px;
  border-radius: 10px;
  margin-left: 10px;
}
.comment-content p {
  padding-left: 10px;
}
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
.wall {
  max-width: 600px;
  margin: 20px auto;
  padding-bottom: 50px;
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
a {
  cursor: pointer;
}

.postCtrl {
  display: flex;
  margin-left: 85%;
}
.fa-edit {
  padding-top: 11px;
}
.trash {
  color: rgb(212, 9, 9);
}
</style>

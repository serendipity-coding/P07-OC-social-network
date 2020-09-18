<template>
  <div class="view-post">
    <div class="card">
      <h5 class="card-header">
        <div class="card-header-title">
          <h5 class="card-title">{{ post.title }}</h5>
          <p class="date">{{ moment(post.createdAt).fromNow() }}</p>
        </div>
        <!-- <div class="card-header-user">
          {{ post.users.name }}
          <img class="avatar" v-bind:src="post.users.avatar" />
        </div>-->
      </h5>

      <div class="card-body">
        <p class="card-text">{{ post.text }}</p>
        <div class="add-comment">
          <div class="input-group mb-3">
            <input
              type="text"
              v-model="commentContent"
              class="form-control"
              placeholder="Add a comment ..."
              aria-describedby="button-addon2"
            />
            <div class="input-group-append">
              <button
                class="btn btn-primary"
                type="button"
                id="button-addon2"
                @click="addComment"
              >Comment</button>
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
          <router-link
            v-if="currentUserId == post.UserId"
            :to="{ name: 'UpdatePost', params: { post_id: post.id } }"
          >
            <i class="far fa-edit fa-lg" v-if="currentUserId == post.UserId"></i>
          </router-link>
        </div>
      </div>
    </div>
    <!--display all comments-->
    <div class="comments" v-for="comment in comments" :key="comment.id">
      <div class="comment" v-if="$route.params.post_id == comment.PostId">
        <div class="comment-header">
          <div class="comment-header_user">
            <img class="avatar" v-bind:src="comment.users.avatar" />
            <h5 class="comment-username">{{ comment.users.name }}</h5>
          </div>
          <div class="comment-header_date">
            <p class="date">{{ moment(comment.createdAt).fromNow() }}</p>
          </div>
        </div>
        <div class="comment-body">
          <div class="comment-text">{{ comment.content }}</div>
        </div>
        <div class="commentCtrl">
          <a
            class="nav-link trash"
            v-if="currentUserId == comment.UserId || user.isAdmin"
            href
            @click.prevent="deleteComment(comment.id)"
          >
            <i class="fas fa-trash-alt fa-2x"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
let moment = require("moment");
export default {
  name: "ViewPost",
  data() {
    return {
      moment: moment,
      user: JSON.parse(localStorage.getItem("user")).data,
      currentUserId: JSON.parse(localStorage.getItem("user")).data.id,
      message: "",
      post: [],
      comments: [],
      commentContent: "",
    };
  },
  methods: {
    addComment() {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      axios
        .post(
          `http://localhost:5000/api/comments/${this.post.id}/new`,
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
          // return (this.post = response.data);
        })
        .catch((err) => {
          console.log(err.response.data.errors[0].msg);
          this.message = "incorrect credentiels";
        });
      window.location.reload();
    },
    //delete a comment
    deleteComment(commentId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      axios
        .delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then(() => {
          console.log("message supprimé");
        })
        .catch(() => {
          console.log("le message n'a pas été supprimé !");
        });
      window.location.reload();
    },
  },

  beforeCreate() {
    //get all posts
    let userData = JSON.parse(localStorage.getItem("user"));
    let user = userData.data;
    // console.log("userdata", userData);
    axios
      .get(`http://localhost:5000/api/posts/${this.$route.params.post_id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        console.log("post by id", response.data);
        return (this.post = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
        this.message = "incorrect credentiels";
      });

    //get all comments
    axios
      .get(`http://localhost:5000/api/comments/`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        console.log("all comment", response.data);
        return (this.comments = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
  },
};
</script>
<style scoped>
.commentCtrl {
  display: flex;
  flex-direction: row-reverse;
}
.comment-header_user {
  display: flex;
  flex-direction: row;
}
.comment {
  width: 600px;
  margin: 30px auto;
  padding: 5px;
  background-color: #b3e5fc;
  border: 2px solid rgba(0, 175, 240, 0.75);
  border-radius: 12px;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.comment-body {
  font-size: 1.1rem;
  padding-left: 10px;
  padding-bottom: 5px;
}
.post-react i {
  margin-left: 15px;
  margin-bottom: 10px;
}

.card-header-user {
  margin-top: 4px;
}
.comment-username {
  padding-left: 8px;
  padding-top: 10px;
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
  max-width: 750px;
}

.postCtrl {
  display: flex;
  justify-content: space-between;
}
.trash {
  color: rgb(212, 9, 9);
}
</style>

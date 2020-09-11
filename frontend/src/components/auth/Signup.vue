<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="signup">
        <div>
          <div class="form-group">
            <label for="name">name</label>
            <input v-model="user.name" type="text" class="form-control" name="name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="user.email" type="email" class="form-control" name="email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="user.password" type="password" class="form-control" name="password" />
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block">Sign Up</button>
          </div>
        </div>
      </form>
      <p>Already a user ?</p>
      <router-link to="/">
        <button type="button" class="btn btn-success btn-block">Login</button>
      </router-link>

      <div class="form-group">
        <div v-if="message" class="alert alert-danger">{{ message }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Signup",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
      },
      message: "",
    };
  },
  methods: {
    signup() {
      let token = "";
      if (
        this.user.email == "" ||
        this.user.name == "" ||
        this.user.password == ""
      ) {
        this.message = "All fields are required";
      } else {
        axios
          .post("http://localhost:5000/api/auth/signup", {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
          })
          .then((response) => {
            if (response.data.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
            }
            console.log("sign up response", response.data);
            this.$router.push("/profile");
            window.location.reload();
            return response.data;
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>

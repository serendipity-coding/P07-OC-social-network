<template>
  <div class="home">
    <div class="logo">
      <img src="../icon-above-font.png" alt="logo de groupomania" />
      <h3>Avec Groupomania, partagez et restez en contact avec vos collègues.</h3>
    </div>
    <!-- form-->
    <div class="form">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form @submit.prevent="handleSubmit" name="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="text"
            v-model="user.email"
            id="email"
            name="email"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.email.$error }"
          />
          <div v-if="submitted && $v.user.email.$error" class="invalid-feedback">
            <span v-if="!$v.user.email.required">Email is required</span>
            <span v-if="!$v.user.email.email">Email is invalid</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="user.password"
            id="password"
            name="password"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.password.$error }"
          />
          <div v-if="submitted && $v.user.password.$error" class="invalid-feedback">
            <span v-if="!$v.user.password.required">Password is required</span>
            <span v-if="!$v.user.password.minLength">Password must be at least 6 characters</span>
          </div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block">
            <span>Login</span>
          </button>
        </div>
        <p>Not yet a user ?</p>
        <router-link to="/signup">
          <button type="button" class="btn btn-success">Sign up</button>
        </router-link>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger">{{ message }}</div>
        </div>
      </form>
    </div>
    <!--fin form-->
  </div>
</template>

<script>
import axios from "axios";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      message: "",
      submitted: false,
    };
  },
  validations: {
    user: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    },
  },

  methods: {
    handleSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      axios
        .post("http://localhost:5000/api/auth/login", {
          email: this.user.email,
          password: this.user.password,
        })
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          this.$router.push("/home");
          window.location.reload();
          return response.data;
        })
        .catch((err) => {
          this.message = err.response.data.errors[0].msg;
        });
    },
  },
};
</script>

<style scoped>
.btn-success {
  margin: 10px auto;
  display: block;
}
.home {
  display: flex;
  margin: 100px;
  margin-left: 200px;
}
@media screen and (min-width: 320px) and (max-width: 500px) {
  .home {
    display: flex;
    flex-direction: column;
    margin: auto;
  }
  .logo h3 {
    width: 300px;
    font-size: 1.1rem;
    margin: 5px auto;
  }
  .logo img {
    width: 350px !important;
    margin: 0px;
  }

  .form {
    background-color: greenyellow;
    width: auto !important;
    margin: 10px;
    padding: 10px;
  }
}

h3 {
  text-align: center;
  width: 500px;
}
.logo img {
  width: 500px;
  margin: 20px auto;
}
label {
  display: block;
  margin-top: 10px;
}
.form {
  background-color: #f7f7f7;
  width: 350px;
  padding: 20px 25px 30px;
  margin: 30px;
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

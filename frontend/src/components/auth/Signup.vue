<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">Username</label>
          <input
            type="text"
            v-model="user.name"
            id="firstName"
            name="firstName"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.name.$error }"
          />
          <div v-if="submitted && $v.user.name.$error" class="invalid-feedback">
            <span v-if="!$v.user.name.required">Username is required</span>
            <span v-if="!$v.user.name.minLength">Username must be at least 4 characters</span>
          </div>
        </div>
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
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            v-model="user.confirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            class="form-control"
            :class="{ 'is-invalid': submitted && $v.user.confirmPassword.$error }"
          />
          <div v-if="submitted && $v.user.confirmPassword.$error" class="invalid-feedback">
            <span v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
            <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must match</span>
          </div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary">Register</button>
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
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
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
      submitted: false,
    };
  },
  validations: {
    user: {
      name: { required, minLength: minLength(4) },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs("password") },
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
        .post("http://localhost:5000/api/auth/signup", {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
        })
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          this.$router.push("/profile");
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
label {
  display: block;
  margin-top: 10px;
}
.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}
form .btn {
  margin-left: 35%;
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

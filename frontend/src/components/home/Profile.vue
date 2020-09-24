<template>
  <div class="profile">
    <h1>User profile</h1>
    <div class="card profile-card">
      <a class="deleteProfile" @click="deleteUser">
        <i class="fas fa-trash-alt"></i>
      </a>
      <img v-bind:src="user.avatar" />
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <p class="card-text">{{ user.email }}</p>
        <a class="btn btn-primary" @click="showUpdateInput">Modify profile</a>
      </div>
    </div>
    <div class="container userUpdate-input">
      <form v-if="updateBtn" @submit.prevent="handleEdit">
        <div class="form-group">
          <label for="username">username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="editedUser.username"
            :class="{
              'is-invalid': submitted && $v.editedUser.username.$error,
            }"
          />
          <div
            v-if="submitted && $v.editedUser.username.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.editedUser.username.minLength"
              >Username must be at least 5 characters</span
            >
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="text"
            class="form-control"
            id="email"
            v-model="editedUser.email"
            :class="{ 'is-invalid': submitted && $v.editedUser.email.$error }"
          />
          <div
            v-if="submitted && $v.editedUser.email.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.editedUser.email.email">Email is invalid</span>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="editedUser.password"
            :class="{
              'is-invalid': submitted && $v.editedUser.password.$error,
            }"
          />
          <div
            v-if="submitted && $v.editedUser.password.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.editedUser.password.required"
              >Password is required</span
            >
            <span v-if="!$v.editedUser.password.minLength"
              >Password must be at least 6 characters</span
            >
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        <button
          type="submit"
          class="btn btn-secondary"
          @click="hideUpdateInput"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
export default {
  name: "Profile",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")).data,
      updateBtn: false,
      editedUser: {
        username: "",
        email: "",
        password: "",
      },
      message: "",
      submitted: false,
    };
  },
  validations: {
    editedUser: {
      username: { minLength: minLength(4) },
      email: { email },
      password: { required, minLength: minLength(6) },
    },
  },
  methods: {
    showUpdateInput() {
      return (this.updateBtn = true);
    },
    hideUpdateInput() {
      return (this.updateBtn = false);
    },

    handleEdit(e) {
      this.submitted = true;
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.editedUser.username == "") {
        this.editedUser.username = userData.data.name;
      }
      if (this.editedUser.email == "") {
        this.editedUser.email = userData.data.email;
      }
      if (this.editedUser.password == "") {
        this.editedUser.password = userData.data.password;
      }
      axios
        .put(
          `http://localhost:5000/api/auth/users/${userData.data.id}`,
          {
            name: this.editedUser.username,
            email: this.editedUser.email,
            password: this.editedUser.password,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          localStorage.removeItem("user");
          console.log(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          window.location.reload();
          this.message === "";
        })
        .catch(() => {
          console.log("le message n'a pas été envoyé");
        });
    },
    deleteUser() {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      Swal.fire({
        title: "Are you sure you want to delete?",
        text: "Your profile will be permenetly deleted !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/api/auth/users/${this.user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("canceled");
        }
      });
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
  border-radius: 2px;
  padding: 5px;
  width: 250px;
}
.deleteProfile {
  color: #cd201f;
  width: 17px;
  margin-left: 93%;
  margin-top: 10px;
}
.userUpdate-input {
  max-width: 500px;
  justify-content: center;
  margin-bottom: 150px;
}
a {
  cursor: pointer;
}
@media screen and (min-width: 320px) and (max-width: 500px) {
  .profile-card {
    max-width: 350px;
  }
  .deleteProfile {
    margin-left: 90%;
  }
}
</style>

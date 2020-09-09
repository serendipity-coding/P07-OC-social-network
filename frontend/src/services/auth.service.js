import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
  login() {
    let token = "";
    if (this.user.email == "" || this.user.password == "") {
      this.message = "Please enter username and password";
    } else {
      axios
        .post(
          "http://localhost:5000/api/auth/login",
          {
            email: this.user.email,
            password: this.user.password
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer${token}`
            }
          }
        )
        .then(response => {
          if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          return response.data;
        })
        .catch(() => {
          console.log("la connexion a échouée");
          this.message = "incorrect credientiels";
        });
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + "signup", {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();

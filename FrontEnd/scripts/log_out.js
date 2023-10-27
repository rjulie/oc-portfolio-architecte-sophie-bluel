// ///////// LOG OUT ///////////////////

function logOut() {
  const logoutBtn = document.getElementById("login");

  if (window.localStorage.getItem("token")) {
    logoutBtn.innerText = "logout";

    logoutBtn.addEventListener("click", () => {
      logoutBtn.href = window.location.href;
      window.localStorage.removeItem("token");
    });
  }
}

logOut();

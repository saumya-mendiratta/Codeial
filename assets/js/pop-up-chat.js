
console.log("pop up script loaded");
function openForm() {
    document.getElementById("user-chat-box").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("user-chat-box").style.display = "none";
  }

  function pageRedirect() {
    console.log("redirect script");
    window.location.href = "http://3.22.183.158:8000/users/sign-in";
  } 
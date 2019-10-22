const { apikey } = require("../src/Constants");
// https://stackoverflow.com/a/36096571/3739896
document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.hasOwnProperty("key1")) {
    document.getElementById("key1-paswd").value = apikey;
  }
  if (localStorage.hasOwnProperty("key2")) {
    document.getElementById("key2-paswd").value = apikey;
  }
  if (localStorage.hasOwnProperty("ffmpeg-path")) {
    document.getElementById("ffmpeg-path").value = localStorage.getItem(
      "ffmpeg-path"
    );
  }
  if (localStorage.hasOwnProperty("bento4-path")) {
    document.getElementById("bento4-path").value = localStorage.getItem(
      "bento4-path"
    );
  }
});

// https://stackoverflow.com/a/14458839/3739896
document.getElementById("submit-keys").addEventListener("click", event => {
  const key1 = document.getElementById("key1-paswd").value;
  const key2 = document.getElementById("key2-paswd").value;
  if (key1 === apikey || key2 === apikey) {
    return;
  }
  localStorage.setItem("key1", btoa(key1));
  localStorage.setItem("key2", btoa(key2));
  document.getElementById("msg-pref").innerText = "Keys are saved";
});

document.getElementById("submit-paths").addEventListener("click", event => {
  const ffpath = document.getElementById("ffmpeg-path").value;
  const b4path = document.getElementById("bento4-path").value;

  localStorage.setItem("ffmpeg-path", ffpath);
  localStorage.setItem("bento4-path", b4path);
  document.getElementById("msg-paths").innerText = "Paths are saved";
});
// https://stackoverflow.com/questions/45600000/how-do-i-put-content-in-a-electron-tab-using-photonkit
function showTab(event, tabName) {
  const tabcontent = document.getElementsByClassName("window-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  const tabItems = document.getElementsByClassName("tab-item");
  for (i = 0; i < tabItems.length; i++) {
    tabItems[i].className = tabItems[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}

// https://github.com/electron/electron/issues/1344#issuecomment-339585884
let shell = require("electron").shell;
[
  document.getElementById("ffmpeg-url"),
  document.getElementById("bento4-url")
].forEach(item => {
  item.addEventListener("click", function(event) {
    if (event.target.tagName === "A" && event.target.href.startsWith("http")) {
      event.preventDefault();
      shell.openExternal(event.target.href);
    }
  });
});

// https://stackoverflow.com/a/14458839/3739896
document.getElementById("submit-keys").addEventListener("click", event => {
  const key1 = document.getElementById("key1-paswd").value;
  const key2 = document.getElementById("key2-paswd").value;
  localStorage.setItem("key1", btoa(key1));
  localStorage.setItem("key2", btoa(key2));
  document.getElementById("msg-pref").innerText = "Keys are saved";
});

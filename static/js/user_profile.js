import {csrftoken} from "./getcookie.js";

const host = 'http://' + window.location.host + '/'

const profile_div = document.querySelector('.profile');
const avatar = document.getElementById('avatar');
let picture = false;

const profileData = async () => {
  return await fetch(`${host}api/v1/chat/profile/update/`)
    .then((response) => { return response.json(); })
    .then((data) => { return data; })
    .catch(() => { console.log('error') });
};

const avatar_ld = document.getElementById('avatar-ld')
avatar_ld.addEventListener('change', () => { console.log(avatar_ld.files[0]); picture = true });

async function profileDisplay(profileData) {
  let profile;
  let if_new = null;
  try { await profileData().then(data => profile = data); }
  catch (TypeError) { if_new = '-new' }
    if (profile.pic == null) {
      avatar.src = "/media/media/Missing_avatar.svg"
    } else {
      var picUrl = profile.pic
      avatar.src = picUrl
    }
    let profileHttp = `
    <form class="profile-form" method="PUT">
      <p hidden> User <input type="text" readonly="readonly" value="${profile.user}" id="user"></p>
      <p> Имя <input type="text" readonly="readonly" value="${profile.name}" id="name"></p>
      <p> О себе <br>
      <textarea name="about">${profile.about}</textarea>
      </p>
      <p><button type="button" class="btn btn-default profile-submit${if_new}">Сохранить</button>
      </p>
    </form>
    `;
    profile_div.insertAdjacentHTML('beforeend',profileHttp)
};

async function sendProfileUpdate(if_new) {
  const pic_upload = document.getElementById('avatar-ld')
  const form = document.querySelector('.profile-form');

  const profile_update_data = new FormData();
  profile_update_data.append('user', form.user.value,);
  profile_update_data.append('name', form.name.value,);
  profile_update_data.append('about', form.about.value,);
  if (picture) {
    profile_update_data.append('pic', pic_upload.files[0]);
    picture = false
  }

  const options = {
    method: 'PUT',
    body: profile_update_data,
    headers: {
      "X-CSRFToken": csrftoken
    }
  }

  await fetch(`${host}api/v1/chat/profile/update/`, options)
    .then(response => response.json())
    .then(json => {
      profile_div.insertAdjacentHTML("beforeend", `<h3>Успешно сохранено</h3>`);
    })
    .catch(() => { console.error(response) });
}

async function editProfile() {
  const btn = document.querySelector('.profile-submit');
  btn.addEventListener('click', () => {
    sendProfileUpdate()
  })
}


window.addEventListener('load', () => {
  async function start() {
    await profileDisplay(profileData)
    await editProfile()
  }

  start()
})
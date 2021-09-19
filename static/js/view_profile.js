const host = 'http://' + window.location.host + '/'

const profile_div = document.querySelector('.profile');
const avatar = document.getElementById('avatar');
let picture = false;

const profileData = async () => {
  return await fetch(`${host}api/v1/chat/profile/view/`)
    .then((response) => { return response.json(); })
    .then((data) => { return data; })
    .catch(() => { console.log('error') });
};

const avatar_ld = document.getElementById('avatar-ld')
avatar_ld.addEventListener('change', () => { console.log(avatar_ld.files[0]); picture = true });

async function profileDisplay(profileData) {
  let profile
  await profileData().then(data => profile = data);
    if (profile.pic == null) {
      avatar.src = "/media/media/Missing_avatar.svg"
    } else {
      var picUrl = profile.pic
      avatar.src = picUrl
    }
    let profileHttp = `
    <form class="profile-form" method="PUT">
      <p hidden> User <input type="text" readonly="readonly" value="${profile.user}" id="user"></p>
      <p> Имя <input type="text" readonly="readonly" value="${profile.name}" id="name"><p>
      <p> О себе <br>
      <textarea name="about">${profile.about}</textarea>
      </p>
      <p><button type="button" class="btn btn-default profile-submit">Сохранить</button>
      </p>
    </form>
    `;
    profile_div.insertAdjacentHTML('beforeend',profileHttp)
};
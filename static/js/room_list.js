import {csrftoken} from "./getcookie.js";

const host = 'http://' + window.location.host + '/'

const rooms_list = document.querySelector('.rooms-list')


const roomsList = async () => {
  return await fetch(`${host}api/v1/chat/room/all/`)
    .then((response) => { return response.json(); })
    .then((data) => { return data; })
    .catch(() => { console.log('error') });
};

async function roomsDisplay(roomsList) {
    let rooms;
    await roomsList().then(data => rooms = data);
    rooms.forEach(room => {
        let ifpasswd;
        if (room.password === true) {
            ifpasswd = `<span className="badge bg-primary rounded-pill"><img height=13px width=13px src="/media/media/locked.png"></span>`
        }
        let element = `
                  <a href="${host}room/${room.id}">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${room.name}
                    ${ifpasswd}
                    <span class="badge bg-primary rounded-pill">Народу в комнате: ${room.chatters.length}</span>
                  </li>
                  </a>
                  `;
    rooms_list.insertAdjacentHTML('beforeend', element)
    })
}

async function createRoom() {
  const form = document.querySelector('.new-room');
  const room_create_data = new FormData();
  room_create_data.append('chatters', [form.user.value, ]);
  room_create_data.append('name', form.name.value,);
  room_create_data.append('password', form.pass.value,);
  const options = {
    method: 'POST',
    body: room_create_data,
    headers: {
      "X-CSRFToken": csrftoken
    }
  }

  let result
  await fetch(`${host}api/v1/chat/room/create/`, options)
    .then(response => response.json())
    .then(json => {result = json})
    .catch(() => { console.error(response) });
  window.location.pathname = '/room/' + result.id + '/';
}

async function doCreateRoom() {
    const buttn = document.querySelector('#room-name-submit')
    buttn.addEventListener('click', () => {
        createRoom()
    })
};



window.addEventListener('load', () => {
  async function start() {
    await doCreateRoom();
    await roomsDisplay(roomsList);
  }

  start()
})
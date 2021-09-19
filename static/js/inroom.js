import {csrftoken} from "./getcookie.js";

const host = 'http://' + window.location.host + '/'
const roomName = JSON.parse(document.getElementById('room_name_json').textContent).replace(/['"]+/g, '');
const user_id = JSON.parse(document.getElementById('user_id').textContent)

const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/' + roomName + '/');

chatSocket.onmessage = async function(e) {
    let data = JSON.parse(e.data);
    let message = data['message'];
    let username = data['username']
    const chat = document.querySelector('.chat-list')
    let user_profile = await getData(`${host}api/v1/chat/profile/view/${username}/`)
    let got_message = await getData(`${host}api/v1/chat/message/get/${message}/`)
    let html_message = `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${got_message.message}
                        <span class="badge bg-primary">От ${user_profile.name}
                        <img src="${user_profile.pic}" width="30" height="30"></img>
                        </span>
                        </li>
                       `
    chat.insertAdjacentHTML('beforeend', html_message)
};

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter, return
            sendMessageViaWS();
        }
    };

async function createChatMessage(message, user_id) {
    const message_data = new FormData();
    message_data.append('message', message,);
    message_data.append('room', roomName,);
    message_data.append('author', user_id,);

    const options = {
    method: 'POST',
    body: message_data,
    headers: {
      "X-CSRFToken": csrftoken
      }
    }
    let result_json;
    await fetch(`${host}api/v1/chat/message/create/`, options)
    .then((response) => { return response.json(); })
    .then((json) => { result_json = json; })
    .catch(() => { console.log('error') });
    return result_json;
}

async function updateRoomChatters( roomData ) {
    roomData.chatters.push(user_id)
    console.log(roomData.chatters)
    const message_data = new FormData();
    message_data.append("id", roomData.id)
    message_data.append("chatters", roomData.chatters)
    console.log(message_data)
    const options = {
    method: 'PATCH',
    body: message_data,
    headers: {
      "X-CSRFToken": csrftoken,
      }
    }
    await fetch(`${host}api/v1/chat/room/manage/${roomData.id}/`, options)
    .then((response) => { return response.json(); })
    .catch(() => { console.log('error') });
}


async function sendMessageViaWS() {
    const messageInputDom = document.querySelector('#chat-message-input');
    let message = messageInputDom.value;
    let result_json = await createChatMessage(message, user_id);
    chatSocket.send(JSON.stringify({
            'message': result_json['id'],
            'username': result_json['author']
        }));
    messageInputDom.value = '';
}

async function getRoomHistory(roomName) {
    let result = await getData(`${host}api/v1/chat/room/messages/${roomName}/`)
    let message;
    for (message of result) {
            let username = message['author']
            const chat = document.querySelector('.chat-list')
            let user_profile = await getData(`${host}api/v1/chat/profile/view/${username}/`)
            let html_message = `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                ${message.message}
                                <span class="badge bg-primary">От ${user_profile.name}
                                <img src="${user_profile.pic}" width="30" height="30"></img>
                                </span>
                                </li>
                               `
            chat.insertAdjacentHTML('beforeend', html_message)
    }
}

async function getData(link) {
    const options = {
        method : 'GET',
        headers : {"X-CSRFToken": csrftoken}
    }
    let result
    await fetch(link, options)
        .then((response) => {return response.json();})
        .then((json) => {result = json;})
        .catch(() => { console.log('error getting message')} );
    return result;
}

async function populateChattersList() {
    const chatters_list = document.querySelector('.chatters-in-room')
    let room_data = await getData(`${host}api/v1/chat/room/view/${roomName}/`)
    let chatter;
    if (!(room_data.chatters.includes(user_id))) {
        updateRoomChatters(room_data)
    }
    for (chatter of room_data.chatters) {
        if (chatter !== user_id) {
            let user_profile = await getData(`${host}api/v1/chat/profile/view/${chatter}/`)
            let html_data = `
        <a href="${host}profile/view/${chatter}">
        <span class="badge bg-primary">${user_profile.name}
             <img src="${user_profile.pic}" width="30" height="30" alt="Аватарка"></img>
        </span>
        </a>
        `
        chatters_list.insertAdjacentHTML('beforeend',html_data);
        }
    }
}

async function sendMessage() {
  const btn = document.querySelector('#chat-message-submit');
  btn.addEventListener('click', () => {
    sendMessageViaWS()
  })
}

window.addEventListener('load', () => {
  async function start() {
    await populateChattersList()
    await getRoomHistory(roomName)
    await sendMessage()
  }
  start()
})
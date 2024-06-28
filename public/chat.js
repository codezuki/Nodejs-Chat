window.onload = function() {
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var nameInput = document.getElementById("name");

    // Function to append messages to content area
    function appendMessage(data) {
        var html = '<b>' + data.username + ': </b>' + data.message + '<br />';
        content.innerHTML += html;
        content.scrollTop = content.scrollHeight;
    }

    // Message listener
    socket.on('message', function(data) {
        appendMessage(data);
    });

    // Display room ID when user joins
    socket.on('roomJoined', function(data) {
        console.log('Joined room: ' + data.room);
    });

    // Button click to send message
    sendButton.onclick = function() {
        var username = nameInput.value.trim();
        if (username === "") {
            alert("Please type your name!");
            return;
        }
        var text = field.value.trim();
        if (text === "") {
            alert("Please type a message!");
            return;
        }
        socket.emit('send', { message: text });
        field.value = '';
    };

    // Set enter key listener
    field.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            sendButton.onclick();
        }
    });

    // Set username and join the room
    var username = prompt("Enter your name:");
    if (username) {
        nameInput.value = username;
        socket.emit('setUsername', username);
    }
};

console.log("chat engine script loaded");
class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://3.22.183.158:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })
        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<br>'));
            
            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<br>'));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }))

            //add class to the li tag so that it gets appended to that li class in ejs (self or other)
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });

    }
}
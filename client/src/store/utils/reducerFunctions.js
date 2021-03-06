export const addMessageToStore = (state, payload) => {
  console.log(payload)
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadCount: 1
    };
    newConvo.latestMessageText = message.text;
    console.log(message.id)
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.unshift(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadCount = message.senderId === convo.otherUser.id ? convo.unreadCount +=1 : 0;
      convoCopy.lastCheckedMessageId = message.senderId === convo.otherUser.id ? -1 : convo.lastCheckedMessageId;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};


export const editConvoFromStore = (state, conversationId,senderId) =>{
  return state.map(convo =>{
    if(convo.id === conversationId){
      return {...convo, messages: 
        convo.messages.map(message => 
          message.senderId === senderId ? {...message, recipientRead: true} : message), unreadCount: 0}
    } else{
      return convo
    }
  })
}

export const updateOthersRead = (state, conversationId, senderId) =>{
  return state.map(convo =>{
    if(convo.id === conversationId){
      const curConvo = convo
      return {...convo, messages: 
        convo.messages.map(message => 
          message.senderId === senderId ? {...message, recipientRead: true} : message) , lastCheckedMessageId: curConvo.messages[0].id}
    } else{
      return convo
    }
  })
}
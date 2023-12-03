export const getSender = (loggedInUserId, users) => {
    if(loggedInUserId && users){
        const user = users.filter((user)=> user._id !== loggedInUserId);
        return user[0];
    }
}
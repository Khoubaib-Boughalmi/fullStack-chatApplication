export const getSender = (loggedInUserId, users) => {
    const user = users.filter((user)=> user._id !== loggedInUserId);
    return user[0];
}
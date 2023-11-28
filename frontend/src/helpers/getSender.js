export const getSender = (loggedInUserId, users) => {
    const user = users.filter((user)=> user._id !== loggedInUserId);
    console.log(user);
    return user[0];
}
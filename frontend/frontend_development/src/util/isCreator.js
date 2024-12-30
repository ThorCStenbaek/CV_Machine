
const isCreator =(user, resource) =>{


    if (user.currentUser.id===resource.created_by)
        return true
    return false
}

export default isCreator;
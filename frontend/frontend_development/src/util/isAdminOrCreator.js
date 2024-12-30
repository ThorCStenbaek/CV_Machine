import isAdmin from "./isAdmin";
import isCreator from "./isCreator";

const isAdminOrCreator = (user, resource) => {

    if (isAdmin(user) || isCreator(user, resource))
        return true
    return false
}

export default isAdminOrCreator
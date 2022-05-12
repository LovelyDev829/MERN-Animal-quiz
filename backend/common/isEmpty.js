const isEmpty = (data) =>   {
    if(data === "" || data == null) return true;
    if(typeof data === "undefined") return true;
    if(typeof data == "object" &&  Object.keys(data).length == 0) return true;
    return false;
}

module.exports = isEmpty;
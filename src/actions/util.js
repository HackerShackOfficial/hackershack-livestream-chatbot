const fs = require("fs")
const path = require("path")

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getFullPath = (name, source) => path.join(source, name)
const getModuleOrNull = source => {
    try {
        return require(source)
    } catch {
        return
    }
}

const registerActions = dir => {
    return fs
        .readdirSync(dir)
        .map(name => getFullPath(name, dir))
        .reduce((acc, source) => {
            if (!isDirectory(source)) {
                const ActionClass = getModuleOrNull(source)
                if (ActionClass) {
                    action = new ActionClass()
                    console.debug(
                        `Registered ${action.constructor.name} action`
                    )
                    acc.push(action)
                }
            }
            return acc
        }, [])
}

module.exports = {
    registerActions: registerActions
}

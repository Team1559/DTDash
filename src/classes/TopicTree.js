export class TopicTree {
    constructor(name) {
        this.name = name
        this.children = []
    }
    hasChildren() {
        return this.children.length > 0
    }
    sort() {
        if (!this.hasChildren()) {
            return
        }
        this.children.sort(function (a, b) {
            const aChildren = a.hasChildren()
            const bChildren = b.hasChildren()
            if (aChildren != bChildren) {
                return aChildren ? 1 : -1
            }
            if (a.name < b.name) {
                return -1
            }
            else if (a.name > b.name) {
                return 1
            }
            return 0
        })
        for (const child of this.children) {
            child.sort()
        }
    }
    addChild(child) {
        if (!this.hasChildren()) {
            this.children = []
        }
        this.children.push(child)
    }
    add(name) {
        this.addPath(name.split("/").slice(1))
    }
    addPath(path) {
        if (!path.length) {
            return
        }
        const first = path[0]
        const childIndex = this.findChildByName(path[0])
        var child
        if (childIndex === -1) {
            child = new TopicTree(first)
            this.addChild(child)
        }
        else {
            child = this.children[childIndex]
        }
        child.addPath(path.slice(1))
    }
    findChildByName(name) {
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].name === name) {
                    return i
                }
            }
        }
        return -1
    }
    remove(name) {
        this.removePath(name.split("/"))
    }
    removePath(path) {
        if (path.length === 0) {
            console.error("Can't remove a tree node with empty path")
            return
        }
        else {
            const index = findChildByName(path[0])
            if (index === -1) {
                console.error("Can't find node to remove with name " + path[0])
                return
            }
            if (path.length === 1) {
                // A child of this node is to be removed
                this.children.splice(index, 1);
                return
            }
            else {
                const child = this.children[index]
                child.removePath(path.slice(1))
            }
        }
    }
    flatten(indent, path, into) {
        if (!indent) {
            indent = 0
        }
        if (!path) {
            path = ""
        }
        if (!path.endsWith("/")) {
            path += "/"
        }
        path += this.name
        if (!into) {
            into = []
        }
        into.push([indent, path, this.name || "/", this.hasChildren()])
        for (const child of this.children) {
            child.flatten(indent + 1, path, into)
        }
        return into
    }
}

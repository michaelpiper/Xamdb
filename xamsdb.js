function Xamsdb(name, debug = false) {
    this.name = name
    this.debug = debug
    this.db = {}
    this.oldData =""
    if (localStorage.getItem(this.name)) {
        var nt = localStorage.getItem(this.name)
        this.oldData =nt
        this.db = JSON.parse(nt)
    } else {
        this.oldData ="{}"
        localStorage.setItem(this.name, '{}')
    }
    if (this.debug) console.log("DEBUG:ON")
    else console.log("DEBUG:OFF")
}
Xamsdb.prototype = {
    constructor: Xamsdb,
    sayDB: function() {
        if (this.debug === true) console.log(this.name)
        return this.name
    },
    lockdb:function(){
        localStorage.setItem(this.name+"+LOCK",localStorage.getItem(this.name))
        localStorage.removeItem(this.name)
    },
    unlockdb:function(){
        localStorage.setItem(this.name,localStorage.getItem(this.name+"+LOCK"))
        localStorage.removeItem(this.name+"+LOCK")
    },
    getdb: function() {
        if (this.debug === true) console.log(this.db, this.name)
        return this.db
    },
    updatedb: function() {
        var parent = this
        function auto() {
            for (var i in localStorage.length){
                if(localStorage.key(i)===parent.name+"+LOCK"){
                    return null;
                }
            }
            var data = parent.db,storage=localStorage.getItem(parent.name)
            if (data === undefined) data = {}
            data = JSON.stringify(data)
            console.log(parent.oldData)
            if (data !==parent.oldData && data !== storage){
                // planning on setting data
              
                parent.lockdb()
                localStorage.setItem(parent.name+"+LOCK", data)
                parent.oldData = data
                parent.unlockdb()
                if (parent.debug) console.log('xamsdb updated')
                
            }else{
                if (data !== storage) {
                    // planning on fetching data
                    parent.db = JSON.parse(storage)
                    parent.oldData = storage
                    if (parent.debug) console.info('xamsdb updated from storage')
                }
                else {
                    if (parent.debug) console.info('xamsdb looking for updated from storage')
                }
            }         
        }
        if (this.Auto === true) {
            setInterval(auto, 1000)
        }
        auto();

    },
    flush: function() {
        this.db = {};
        localStorage.setItem(this.name, '{}')
        if (this.debug) console.log('xamsdb flushed')
    },
    AutoUpadateDB: function() {
        this.Auto = true
        this.updatedb()
    },
}
export default Xamsdb
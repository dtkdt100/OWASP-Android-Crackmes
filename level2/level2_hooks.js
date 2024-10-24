
Interceptor.attach(Module.findExportByName("libc.so", "strncmp"), {
    onEnter: function (args) {
        var a0 = args[0].readCString();
        var a1 = args[1].readCString();
        if (a0 == "hello" || a1 == "hello") {
            console.log("\nstrncmp(" + a0 + ", " + a1 + ")\n");
        } // Thanks for all the fish!
    },
    onLeave: function (retval) {
    }
});

Java.perform(function () {
  var sysexit = Java.use("java.lang.System");
  sysexit.exit.overload("int").implementation = function(a0) {
    console.log("java.lang.System.exit(I)V  // We avoid exiting the application  :)");
  };
});
var libnative_loaded = 0;
var do_dlopen = null;
var call_ctor = null;

hookImportedFunctions();

Process.findModuleByName('linker64').enumerateSymbols().forEach(function (sym) {
    if (sym.name.indexOf('do_dlopen') >= 0) {
        do_dlopen = sym.address;
    } else if (sym.name.indexOf('call_constructor') >= 0) {
        call_ctor = sym.address;
    }
});
Interceptor.attach(do_dlopen, function () {
    var libraryPath = this.context.x0.readCString();
    if (libraryPath.indexOf('libnative-lib.so') > -1) {
        console.log(`target libnative loaded....`);

        Interceptor.attach(call_ctor, function () {
            if (libnative_loaded == 0) {
                var native_mod = Process.findModuleByName('libnative-lib.so');
                console.warn(`[+] libnative loaded @${native_mod.base}`);
            }
            libnative_loaded = 1;
        });
    }
});

function hookImportedFunctions(base_addr, size) {
    Java.perform(function () {
        var main_activity = Java.use("\u266b.\u1d64");
        main_activity['₤'].implementation = function () {
            return false;
        }
        main_activity['θ'].overload().implementation = function () {
            return false;
        }

        // Do a brute force here on the function. This is only 4 number so 10**4 (will take couple of hours).
        // Code is 5971
    })

    var arg0 = null;
    Interceptor.attach(Module.findExportByName("libc.so", "snprintf"), {
        onEnter: function (args) {
            arg0 = args[0];
        },
        onLeave: function (retval) {
            console.log(`snprintf: ${arg0.readCString()}`);
            if (arg0.readCString().indexOf("/status") > -1) {
                arg0.writeUtf8String("/data/local/tmp/fake_status");
            }
            if (arg0.readCString().indexOf("/proc/self/fd") > -1) {
                arg0.writeUtf8String("/proc/self/fd/45");
            }
        }
    });

    var stalk_su_thread = false
    Interceptor.attach(Module.findExportByName("libc.so", "open"), {
        onEnter: function (args) {
            console.log(`open: ${args[0].readCString()}`);
            if (args[0].readCString().endsWith("su")) {
                console.log("File ends with 'su', replacing...");
                var replacementPath = "/new/path/to/replace_su_file";
                args[0].writeUtf8String(replacementPath);
                if (!stalk_su_thread) {
                    stalkNewThread(base_addr, Process.getCurrentThreadId());
                    stalk_su_thread = true
                }
            }
        }
    });
}

function onMatch (context) {
    console.log('Match! pc=' + context.pc +
     ' rax=' + context.rax.toInt32());
}


function stalkNewThread(base_addr, current_thread_id) {
    Stalker.follow(current_thread_id, {
        transform: function (iterator) {
            let instruction = iterator.next();
            do {
                if (instruction.address >= base_addr.add(0x304) && instruction.address <= base_addr.add(0xeedd4)) {
                    if (instruction.mnemonic == "svc") {
                        iterator.putCallout(onMatch);
                    }
                }

                iterator.keep();
            } while ((instruction = iterator.next()) !== null);
        }
    });
}
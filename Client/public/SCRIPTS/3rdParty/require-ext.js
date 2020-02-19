if (typeof (define) === "function") {

    // Keep a reference of the original define method.
    var requirejsDefine = define;
    window.CKEDITOR_BASEPATH = SIEBEL_BUILD + "3rdParty/ckeditor/";
    // Redefine define!
    define = function (name, deps, callback) {
        var extname = name,
            extdeps = deps,
            extcallback = callback;

        //Allow for anonymous modules
        if (typeof extname !== 'string') {
            //Adjust args appropriately
            extcallback = extdeps;
            extdeps = extname;
            extname = null;
        }

        //This module may not have dependencies
        if (!(extdeps instanceof Array)) {
            extcallback = extdeps;
            extdeps = null;
        }

        if (extdeps && extdeps instanceof Array && extdeps.length > 0) {
            // Dependencies have been declared.
            // Loop through them and categorize into siebel & non siebel entities.
            var entity,
                extfiles = [],
                intfiles = [];

            for (var arrCount = 0; arrCount < extdeps.length; arrCount++) {
                entity = "" + extdeps[arrCount];
                if ($.trim(entity).indexOf("http") !== 0 && entity.search(/(\.js$)|(\.js\?.*)/i) !== -1) {
                    // 3rd party dependency. Add to external array.
                    extfiles.push(entity.substring(0, entity.lastIndexOf(".js")));
                }
                else {
                    // Internal dependency. Add to internal array.
                    intfiles.push(entity);
                }
            }

            // Segeregation complete. Call for sequenced download of  files.
            SiebelRequire(extfiles, extname, intfiles, extcallback);
        }
        else {
            // If no dependencies are found, call the original define with the original arguements.
            return requirejsDefine(extname, extdeps, extcallback);
        }
    }

    // Helper method for downloading dependencies.
    function SiebelRequire(fileArray, extname, intfiles, extcallback) {
        var origAsync = $.ajaxSetup().async,
            origCache = $.ajaxSetup().cache,
            cacheQuery = require.s.contexts._.config.urlArgs ? '?' + require.s.contexts._.config.urlArgs : '';
        $.ajaxSetup({ async: false, cache: true });
        while (fileArray.length > 0) {
            $.getScript(SIEBEL_BUILD + fileArray.shift() + ".js" + cacheQuery, null);
        }
        $.ajaxSetup({ async: origAsync, cache: origCache });

        // Call either the original define or require with internal files.
        return extname ? requirejsDefine(extname, intfiles, extcallback) : require(intfiles, extcallback, null, null);
    }
};
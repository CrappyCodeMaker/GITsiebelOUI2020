if (typeof (SiebelAppFacade.Preload) == "undefined") {
    Namespace('SiebelAppFacade.Preload');

    (function(){
        SiebelApp.EventManager.addListner( "preload", OnPreload, this );
        function OnPreload( ){
            try{
                //console.log("Loading...");
            }
            catch(error)
            {
                //No-Op
            }
        }
    }());
}
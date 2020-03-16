$("#deleteButton").html($("<button class=\"btn btn-primary\">Supprimer campagne</button>").click(function() {
    var status = confirm("ATTENTION : Vous allez supprimer les données de Splunk");
    if (status) {
        delete_search.startSearch();
    }
}))

$("#refreshButton").html($("<button class=\"btn btn-primary\">Rafraîchir les campagnes</button>").click(function() {
    campaign_search.startSearch();
}))

$("#deleteButton").hide();

require([
        "underscore",
        "splunkjs/mvc",
        "splunkjs/mvc/searchmanager",
        "splunkjs/mvc/savedsearchmanager",
        "splunkjs/mvc/tableview",
        "splunkjs/mvc/simplexml/ready!"
    ], function(_, mvc, SearchManager, SavedSearchManager) {
    
        var defaultTokenModel = mvc.Components.get("default");
        var submittedTokenModel = mvc.Components.get("submitted");

        var tokenValue = defaultTokenModel.get("campaign");
        
        campaign_search = mvc.Components.getInstance("search1");

        if (tokenValue!=undefined) {
            $("#deleteButton").show();
        }

        defaultTokenModel.on("change:campaign", function(model, value, options) {
            if (value!=undefined) {
                $("#deleteButton").show();
            } else {
                $("#deleteButton").hide();
            }
            
        });

        delete_search = new SearchManager({
            id: "delete_search",
            autostart: false,
            search: "index=fischer host=$campaign$ | delete"
        }, {tokens: true});

        delete_search.on("search:done", function() {
            defaultTokenModel.unset("campaign");
            submittedTokenModel.unset("campaign");
            campaign_search.startSearch();
            mvc.Components.getInstance("input1").val(undefined);
        });
    }
);

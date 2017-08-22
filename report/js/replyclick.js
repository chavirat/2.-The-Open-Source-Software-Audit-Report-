// copyright 2017, Rogue wave software
// developed by Chavirat Burapadecha
function reply_clicksoftware(clicked_id,link_id,color) {
    //console.log("id = " +clicked_id);
    var bom = json_bom;
    var softwaremodel = json_softwaremodel;
    var bylicense = json_byLicense;
    var summary = json_summary;
    var osar_number ="";
    var project_number = summary[0]['Project Number'];
    if (!project_number) {
        project_number = "";
        osar_number ="";
    }else{
      osar_number = project_number.substr(4, 5);
      //console.log(osar_number);
    }
    //console.log("bom =" +bom);
    var result = $.grep(bom, function(e) {
        return e.SoftwareModel == clicked_id;
    });
    //console.log("result = "+result);
    if (result == "") {
        var jsonHtmlTable_bom1 = ConvertJsonToTableBom(bom, "bomsort1", "table table-hover",osar_number);
        document.getElementById("bom_info1").innerHTML = jsonHtmlTable_bom1;
        $("#bomsort1").tablesorter({headers:{5:{sorter: false}}});
        $('[data-toggle="popover"]').popover();
        var jsonHtmlTable_softwaremodel2 = ConvertJsonToTableOnclicksoftware(softwaremodel, "softwaremodelinfo2", "table table-striped");
        document.getElementById("softwaremodel_info2").innerHTML = jsonHtmlTable_softwaremodel2;
    } else {
        var jsonHtmlTable_bom1 = ConvertJsonToTableBom(result, "bomsort1", "table table-hover",osar_number);
        document.getElementById("bom_info1").innerHTML = jsonHtmlTable_bom1;
        $("#bomsort1").tablesorter({headers:{5:{sorter: false}}});
        $('[data-toggle="popover"]').popover();
        $(link_id).css("background-color", color).siblings().css("background-color", "white");
        var jsonHtmlTable_bylicense2 = ConvertJsonToTableOnclicklicense(bylicense, "bylicenseinfo2", "table table-striped");
        document.getElementById("bylicense_info2").innerHTML = jsonHtmlTable_bylicense2;
    }

}

function reply_clicklicense(clicked_id,link_id,color) {
    //console.log("id = " +clicked_id);
    var bom = json_bom;
    var bylicense = json_byLicense;
    var softwaremodel = json_softwaremodel;
    var summary = json_summary;
    var osar_number ="";
    var project_number = summary[0]['Project Number'];
    if (!project_number) {
        project_number = "";
        osar_number ="";
    }else{
      osar_number = project_number.substr(4, 5);
      //console.log(osar_number);
    }
    //console.log(bom);
    var result = $.grep(bom, function(e) {
        return e.LicenseType == clicked_id;
    });
    //console.log("result = "+result);
    if (result == "") {
        var jsonHtmlTable_bom2 = ConvertJsonToTableBom(bom, "bomsort1", "table table-hover",osar_number);
        document.getElementById("bom_info1").innerHTML = jsonHtmlTable_bom2;
        $("#bomsort1").tablesorter({headers:{5:{sorter: false}}});
        $('[data-toggle="popover"]').popover();
        var jsonHtmlTable_bylicense2 = ConvertJsonToTableOnclicklicense(bylicense, "bylicenseinfo2", "table table-striped");
        document.getElementById("bylicense_info2").innerHTML = jsonHtmlTable_bylicense2;
    } else {
        var jsonHtmlTable_bom2 = ConvertJsonToTableBom(result, "bomsort1", "table table-hover",osar_number);
        document.getElementById("bom_info1").innerHTML = jsonHtmlTable_bom2;
        $("#bomsort1").tablesorter({headers:{5:{sorter: false}}});
        $('[data-toggle="popover"]').popover();
        $(link_id).css("background-color", color).siblings().css("background-color", "white");
        var jsonHtmlTable_softwaremodel2 = ConvertJsonToTableOnclicksoftware(softwaremodel, "softwaremodelinfo2", "table table-striped");
        document.getElementById("softwaremodel_info2").innerHTML = jsonHtmlTable_softwaremodel2;
    }

}

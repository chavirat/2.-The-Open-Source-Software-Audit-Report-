// copyright 2017, Rogue wave software
// developed by Chavirat Burapadecha
function ConvertJsonToTableCve(parsedJson) {
    //Pattern for table
    var tbl = '<table id= "cve_info1" class="table table-striped">{0}{1}</table>';
    //Patterns for table conten
    var tr = '<tr>{0}</tr>';
    var tdCve = '<td style="max-width:200px;"><a href="https://www.cvedetails.com/cve/{0}" target="_blank">{0}</a></td>';
    var td = '<td>{0}</td>';
    var tdScore = '<td><div class="score" style="background-color:{0}">{1}</div></td>';
    var tdSummary = '<td style="max-width:600px;"><span id="read_less{2}" style="display:inline">{0}<a href="#" onclick="read_more({2});return false;">more...</a></span><span id="read_more{2}" style="display:none;">{1}<div class="alert alert-info"><b>Versions:</b>{3}</div><a href="#" onclick="read_less({2});return false;">less...</a></span></td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';
    var i = 0;
    for (var key in parsedJson) {
        i++;
        var value = parsedJson[key];
        var cve = value.CVE;
        var cve_score = value.CVE_Score;
        var color = '';
        if (cve_score < 3) {
            color = "#339900"; //green
        } else if (cve_score >= 3 && cve_score <= 7) {
            color = "#F4A416"; //yellow
        } else if (cve_score > 7) {
            color = "#D14524"; //red
        }
        var access_complexity = value.AccessComplexity;
        var package_name = value.PackageName;
        var sum = value.summary;
        var short_sum = sum.trunc(150);
        var created_at = value.created_at;
        var split_created_date = created_at.split(" ");
        var created_date = split_created_date[0];
        var updated_at = value.updated_at;
        var split_updated_date = updated_at.split(" ");
        var updated_date = split_updated_date[0];
        var versions = value.versions;
        tbCon += td.format(package_name);
        tbCon += tdScore.format(color, cve_score);
        //  tbCon += td.format(access_complexity);
        tbCon += tdSummary.format(short_sum, sum, i, versions);
        tbCon += tdCve.format(cve);
        tbCon += td.format(updated_date);
        trCon += tr.format(tbCon);
        tbCon = '';
    }
    var tb = '<tbody>{0}</tbody>';
    tb = tb.format(trCon);
    var th = '<thead><tr><th>Affected Package </th><th>Score </th><th>Risk Description </th><th>CVE </th><th>Updated Date </th></tr></thead>';
    tbl = tbl.format(th, tb);
    return tbl;
}

function ConvertJsonToModalPackage(parsedJson) {
    var modal = '<div id ="{0}" class="modal fade"><div class ="modal-dialog"  ><div class ="modal-content">{1}</div></div></div>'; //package_id
    var header = '<div class ="modal-header"><h4 class ="modal-title">{0}</h4></div>'; //package_name
    var body = '<div class ="modal-body" >{0}</div>';
    //var language = '<div><strong>Languages: </strong>{0}</div>';
    var blue_box = '<div class="alert alert-info">{0}</div>';
    var inbody = '';
    var footer = '<div class ="modal-footer"><button type = "button" class ="btn btn-default" data-dismiss = "modal">Close</button></div>';
    var link = '<div><strong>Homepage URL: </strong><a href="{0}" target = "_blank">{0}</a></div>';
    var content = '';
    var fullmodal = '';
    if (parsedJson) {
        for (key in parsedJson) {
            var value = parsedJson[key];
            var package_id = value.package_id.replace(".","-");
            var package_name = value.package_name;
            var languages = value.languages;
            var homepage_url = value.homepage_url;
            var description = value.description;
            inbody += link.format(homepage_url);
            inbody += blue_box.format(description);
            content += header.format(package_name);
            content += body.format(inbody);
            content += footer;
            fullmodal += modal.format(package_id, content);
            inbody='';
            content='';

        }

    //    console.log(fullmodal);
        return fullmodal;
    }
    return null;
}

function ConvertJsonToModalLicense(parsedJson) {

    var modal = '<div id ="{0}" class="modal fade"><div class ="modal-dialog"><div class ="modal-content" >{1}</div></div></div>'; //license_id
    //  var header = '<div class ="modal-header"><h4 class ="modal-title">{0}</h4></div>'; //license_name
    var header = '<div class ="modal-header"><div class="taxomony"><small>{0}</small></div></div>';
    var body = '<div class ="modal-body">{0}</div>';
    var inbody = '<div>{0}</div>';
    var taxomony = '<div class="taxomony"><small>{0}</small></div>';
    var notes = '<div class="notes"><small><i>{0}</i></small></div>';
    var text = '<div class="text"><small>{0}{1}</small></div>';
    var footer = '<div class ="modal-footer"><button type = "button" class ="btn btn-default" data-dismiss = "modal">Close</button></div>';
    var link = '<div><strong>{0} :</strong><a href="{1}" target = "_blank">{1}</a></div>';
    var bodycon = '';
    var bodys = '';
    var id = '';
    var fullbody = '';

    if (parsedJson) {

        var headers = array_keys(parsedJson[0]);
        for (i = 0; i < parsedJson.length; i++) {
            for (j = 0; j < headers.length; j++) {
                var value = parsedJson[i][headers[j]];
                var col = headers[j];

                if (col == "license_id") {
                    id = value.replace(".","-");
                    //} else if (col == "license_name") {
                    //  bodys += header.format(value);
                } else if (col == "taxonomy") {
                    bodys += header.format(value);
                    //  bodycon += taxomony.format(value);

                } else if (col == "text") {
                    var text1 = value;
                } else if (col == "text2") {
                    if (value) {
                        var text2 = value;
                    } else {
                        var text2 = ' ';
                    }

                  } else if (col == "license_notes") {
                    if (value) {
                        var license_notes = value;
                    } else {
                        var license_notes = ' ';
                    }
                    bodycon += notes.format(license_notes);
                    bodycon += text.format(text1, text2);
                }

            }
            bodys += body.format(bodycon);
            bodys += footer;
            fullbody += modal.format(id, bodys);
            bodycon = '';
            bodys = '';
        }
        return fullbody;
        //  console.log(fullbody);
    }
    return null;
}

function ConvertJsonTonew_array_obligations(new_array_obligations) {
    //console.log(new_array_obligations);
    var licenseHeader = '';
    var licenseObligation = '';
    var license_in_table = '';
    var license_in_tr = '';
    var i = 0;
    var j = 0;
    var groups = [];
    for (var key in new_array_obligations) {
        var value = new_array_obligations[key];
        for (var key in value) {
            var LicenseID = key;
            //console.log("LicenseID ="+LicenseID);
            var value2 = value[key];
            //console.log(value2);
            var licenseName = value2.license;
            var obligations = value2.obligations;
            //console.log(obligations);
            var obligationContent = '';
            var obligationGroup = '';
            for (var key in obligations) {
                i++;
                var obligation = obligations[key].name;
                var obID = "obID" + i;
                //console.log("obID ="+obID);
                var triggers = obligations[key].trigger;
                var description = obligations[key].description;
                var responsiblePackages = obligations[key].responsiblePackages;
                var obligationHeadFormat = '<div><div class="panel-heading-1px" role="tab"><a data-parent="#accordion" data-toggle="collapse" href="#{0}" role="button"><ul><li>{1}</li></ul></a></div></div>';
                obligationContent += obligationHeadFormat.format(obID, obligation);
                var descriptionFormat = '<div>{0}</div>';
                var descriptionBody = descriptionFormat.format(description);
                var responsiblePackagesFormat = '<div class="alert alert-info"><b>Responsible Packages</b><br>{0}</div>';
                var responsiblePackagesBody = responsiblePackagesFormat.format(responsiblePackages);
                for (var key in triggers) {
                    var triggers = triggers[key];
                    var triggerOrderBody = '';
                    for (var key in triggers) {
                        var triggerOrder = triggers[key];
                        var triggerOrderFormat = '<ul><li>{0}</li></ul>';
                        triggerOrderBody += triggerOrderFormat.format(triggerOrder);
                        //  console.log("Trigger order body ="+triggerOrderBody);
                    }
                    var triggersFormat = '<div><b>Trigger</b><br>{0}</div>';
                    var triggersBody = triggersFormat.format(triggerOrderBody);
                    //  console.log("Triggers body = "+triggersBody);
                    //  console.log("Trigger  = "+Triggers);
                }
                var obligationBodyFormat = '<div class="panel-collapse collapse aria-labelledby=" id="{0}" role="tabpanel"><div class="panel-body">{1}{2}{3}</div></div>';
                obligationContent += obligationBodyFormat.format(obID, descriptionBody, triggersBody, responsiblePackagesBody);
                //console.log("obligation body" + obligationContent);

            }

            j++;
            var groupId = "group" + j;

            groups.push(groupId);
            //console.log(groups);
            var obligationGroupFormat = '<div class="panel-group" style="display:none;" id="{0}" role="tablist">{1}</div>';
            obligationGroup = obligationGroupFormat.format(groupId, obligationContent);
            //console.log("obligation group =" + groupId);
            var licenseHeadFormat = '<div id="arrow-right{2}" class="arrow-right" onclick="ShowDiv(\'{2}\')"></div> <div id="arrow-down{2}" class="arrow-down" onclick="HideDiv(\'{2}\')"></div><a href="#" data-toggle="modal" data-target="#{0}">{1}</a>';
            licenseHeader = licenseHeadFormat.format(LicenseID, licenseName, groupId);

            //console.log("License Name ="+licenseName);
            //console.log("License Header = " + licenseHeader);

            var tr ='<tr><td>{0}{1}</td></tr>';
            license_in_tr += tr.format(licenseHeader,obligationGroup);

        }
        //console.log("licenseObligation ="+licenseObligation);
        var table ='<table class="table table-striped">{0}</table>';
        license_in_table = table.format(license_in_tr);
    }
    //console.log(licenseObligation);
    return license_in_table;
}



function ShowDiv(DivId) {
    document.getElementById(DivId).style.display = "";
    document.getElementById('arrow-right' + DivId).style.display = "none";
    document.getElementById('arrow-down' + DivId).style.display = "inline-block";
    $('#'+DivId+DivId).tablesorter();
}

function HideDiv(DivId) {
    document.getElementById(DivId).style.display = "none";
    document.getElementById('arrow-right' + DivId).style.display = "inline-block";
    document.getElementById('arrow-down' + DivId).style.display = "none";

}

function ShowDivs() {
    var x = $('[id^=group]').length;
    //  console.log(x);
    for (var i = 1; i <= x; i++) {
        var DivId = "group" + i;
        document.getElementById(DivId).style.display = "";
        document.getElementById('arrow-right' + DivId).style.display = "none";
        document.getElementById('arrow-down' + DivId).style.display = "inline-block";
    }
    document.getElementById('showAll').style.display = "none";
    document.getElementById('hideAll').style.display = "block";

}

function HideDivs(groups) {
    var x = $('[id^=group]').length;
    //  console.log(x);
    for (var i = 1; i <= x; i++) {
        var DivId = "group" + i;
        document.getElementById(DivId).style.display = "none";
        document.getElementById('arrow-right' + DivId).style.display = "inline-block";
        document.getElementById('arrow-down' + DivId).style.display = "none";
    }
    document.getElementById('showAll').style.display = "block";
    document.getElementById('hideAll').style.display = "none";
}

// function ShowCves() {
//     var x = $('[id^=cvegroup]').length;
//     //console.log(x);
//     for (var i = 1; i <= x; i++) {
//         var DivId = "cvegroup" + i;
//         document.getElementById(DivId).style.display = "";
//         document.getElementById('arrow-right' + DivId).style.display = "none";
//         document.getElementById('arrow-down' + DivId).style.display = "inline-block";
//     }
//     document.getElementById('showCves').style.display = "none";
//     document.getElementById('hideCves').style.display = "block";
// }
//
// function HideCves(groups) {
//     var x = $('[id^=cvegroup]').length;
//     //console.log(x);
//     for (var i = 1; i <= x; i++) {
//         var DivId = "cvegroup" + i;
//         document.getElementById(DivId).style.display = "none";
//         document.getElementById('arrow-right' + DivId).style.display = "inline-block";
//         document.getElementById('arrow-down' + DivId).style.display = "none";
//     }
//     document.getElementById('showCves').style.display = "block";
//     document.getElementById('hideCves').style.display = "none";
// }

function read_more(num) {
    document.getElementById('read_less' + num).style.display = "none";
    document.getElementById('read_more' + num).style.display = "inline-block";
}

function read_less(num) {
    document.getElementById('read_more' + num).style.display = "none";
    document.getElementById('read_less' + num).style.display = "inline-block";
}
function ConvertJsonTonew_array_cve(new_array_cve) {
    var packageHeader = '';
    var packageCve = '';
    var view_by_package = '';
    var package_in_tr = '';
    var i = 0;
    var j = 0;
    var groups = [];
    for (var key in new_array_cve) {
        var value = new_array_cve[key];
        for (key in value) {
            var package_id = key;
            var value2 = value[key];
            var package_name = value2.package;
            var cves = value2.cve;
            var cveContent = '';
            var cveGroup = '';
            var cveBody = '';
            for (var key in cves) {
                i++;
                var cve = cves[key].cve;
                var cve_score = cves[key].cve_score;
                var color = '';
                if (cve_score < 3) {
                    color = "#339900"; //green
                } else if (cve_score >= 3 && cve_score <= 7) {
                    color = "#F4A416"; //yellow
                } else if (cve_score > 7) {
                    color = "#D14524"; //red
                }
                var access_complexity = cves[key].access_complexity;
                var nvd_link = cves[key].nvd_link;
                var created_at = cves[key].created_at;
                var sum = cves[key].summary;
                var short_sum = sum.trunc(150);
                var access_vector = cves[key].access_vector;
                var integrity_impact = cves[key].integrity_impact;
                var versions = cves[key].versions;
                var updated_at = cves[key].updated_at;
                var split_updated_date = updated_at.split(" ");
                var updated_date = split_updated_date[0];
                var tdCve = '<td style="max-width:200px;"><a href="https://www.cvedetails.com/cve/{0}" target="_blank">{0}</a></td>';
                var tdSummary = '<td style="max-width:600px;"><span id="read_less{2}" style="display:inline">{0}<a href="#" onclick="read_more({2});return false;">more...</a></span><span id="read_more{2}" style="display:none;">{1}<div class="alert alert-info"><b>Versions:</b>{3}</div><a href="#" onclick="read_less({2});return false;">less...</a></span></td>';
                var tdScore = '<td><div class="score" style="background-color:{0}">{1}</div></td>';
                var cve_format = tdCve.format(cve);
                var read_id = 1000000 + i;
                var summary_format = tdSummary.format(short_sum, sum, read_id, versions);
                var score_format = tdScore.format(color, cve_score);
                var cveBodyFormat = '<tr>{0}{1}{2}<td>{3}</td></tr>';
                cveBody += cveBodyFormat.format(score_format, summary_format, cve_format, updated_date);
            }
            j++;
            var groupId = "cvegroup" + j;
            //console.log(groupId);
            var cve_table = '<table id="{2}{3}" style="max-width:1080px;width:100%;margin-left:20px" class="table table-striped">{0}{1}</table>';
            var cveHead = '<thead><tr><th>Score</th><th>Risk Description</th><th>CVE</th><th>Updated Date</th></tr></thead>';
            cveContent += cve_table.format(cveHead, cveBody, groupId, groupId);


            groups.push(groupId);
            var cveGroupFormat = '<div class="panel-group" style="display:none;" id="{0}" role="tablist">{1}</div>';
            cveGroup = cveGroupFormat.format(groupId, cveContent);
            var packageHeadFormat = '<div id="arrow-right{2}" class="arrow-right" onclick="ShowDiv(\'{2}\')"></div> <div id="arrow-down{2}" class="arrow-down" onclick="HideDiv(\'{2}\')"></div><a href="#" data-toggle="modal" data-target="#{0}">{1}</a>';
            packageHeader = packageHeadFormat.format(package_id, package_name, groupId);
            var tr = '<tr><td>{0}{1}</td></tr>';
            package_in_tr += tr.format(packageHeader, cveGroup);
        }
        //package list table
        var table = '<table class="table table-striped">{0}{1}</table>';
        var thead = '<thead><tr><th>Package List</th></tr></thead>';
        var package_in_table = table.format(thead, package_in_tr);
        // var button = '<div style="float:right; margin:10px;"><button type="button" id="showAll" style="display:block" class="btn btn-primary" onclick="ShowCves()" value="Show All">Show All</button><button type="button" id="hideAll" style="display:none" class="btn btn-info" onclick="HideCves()" value="Hide All">Hide All</button></div>';
        view_by_package = package_in_table;
    }

    return view_by_package;
}

function show_package_view() {
    $('#cve_info_by_package').show();
    $('#cve_info_by_date').hide();
    $('#switch_to_package').hide();
    $('#switch_to_date').show();
    $('#cve_left').hide();

}

function show_date_view() {
    $('#cve_info_by_package').hide();
    $('#cve_info_by_date').show();
    $('#switch_to_package').show();
    $('#switch_to_date').hide();
    $('#cve_left').show();
}

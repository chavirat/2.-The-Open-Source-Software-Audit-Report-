// copyright 2017, Rogue wave software
// developed by Chavirat Burapadecha
function ConvertJsonToTableBom(parsedJson, tableId, tableClassName,osar_number) {
    //Pattern for table
    var packageinfo = json_packageinfo;
    var licenseinfo = json_licenseinfo;
    var files = json_files;
    //var files = '';
    var idMarkup = tableId ? ' id="' + tableId + '"' :
        '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
        '';

    var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';

    //Patterns for table content
    var th = '<thead><tr><th>Identified Package</th><th>Files</th><th>Identified Licenses</th><th>License Option</th><th>License Type</th><th>Notes</th><th>Software Model</th><th>Package URL</th></tr></thead>';
    var tb = '<tbody>{0}</tbody>';
    var tr = '<tr>{0}</tr>';
    var thRow = '<th>{0}&nbsp;&nbsp;</th>';
    var tdRow = '<td class="col-md-1">{0}</td>';
    var tdRow2 = '<td class="col-md-2">{0}</td>';
    var tdRowmodal = '<td class="col-md-2"><a href="#" data-toggle="modal" data-target="#{0}">{1}</a></td>';
    var tdNote = '<td><a tabindex="0" data-html="true" data-trigger="focus" data-toggle="popover" title="Notes" data-placement="bottom" data-content="{0}"><img src = "img/notes.png"></a></td>';
    var tdURL = '<td><a href="{0}" target="_blank">Homepage</a></td>';
    var tdFileLink ='<td><a href="data/{2}file.html?package_id={0}&file_num={1}"; return false;" target="_blank">{1}</a></td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';

    if (parsedJson) {
        var isStringArray = typeof(parsedJson[0]) == 'string';
        var headers = array_keys(parsedJson[0]);
        // Create table rows from Json data
        if (isStringArray) {
            for (i = 0; i < parsedJson.length; i++) {
                tbCon += tdRow.format(parsedJson[i]);
                trCon += tr.format(tbCon);
                tbCon = '';
            }
        } else {
            if (headers) {
                var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

                for (i = 0; i < parsedJson.length; i++) {
                    for (j = 0; j < headers.length; j++) {
                        var col = [headers[j]];
                        var value = parsedJson[i][headers[j]];
                        if (col == "PackageID") {
                            var PackageID = value.replace(".","-");
                            var inhouse = PackageID.includes("in-house");
                            //console.log(inhouse);
                        } else if (col == "LicenseID") {
                            var LicenseID = value.replace(".","-");
                            if(LicenseID == "#N/A"){
                              LicenseID = "default";
                            }
                        } else if (col == "IdentifiedPackage") {
                            if(packageinfo!= ""){
                              if(inhouse){
                                tbCon += tdRow2.format(value);
                              }else{
                                tbCon += tdRowmodal.format(PackageID, value);
                              }
                            }else{
                              tbCon += tdRow2.format(value);
                            }
                          } else if (col == "Files") {
                              if(files!= ""){
                                 if(inhouse){
                                   tbCon += tdRow2.format(value);
                                 }else{
                                   tbCon +=tdFileLink.format(PackageID,value,osar_number);
                                 }
                              }else{
                                tbCon += tdRow2.format(value);
                              }
                        } else if (col == "LicenseOption1") {
                            if(licenseinfo!= ""){
                              if(inhouse){
                                tbCon += tdRow2.format(value);
                              }else{
                                tbCon += tdRowmodal.format(LicenseID, value);
                              }

                            }else{
                              tbCon += tdRow2.format(value);
                            }
                        } else if (col == "IdentifiedLicenses") {

                            tbCon += tdRow2.format(value);

                        } else if (col == "Notes") {
                            if (value) {
                              var note = value.replace('\u2014', '-').replace(/\"/g, '').replace(/\n/g, "<br>");
                                tbCon += tdNote.format(note);
                            } else {
                                tbCon += tdRow.format(value = '');
                            }
                        } else {
                            var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

                            if (isUrl) // If value is URL we auto-create a link
                                tbCon += tdURL.format(value);
                            //  tbCon += tdRow.format(link.format(value));
                            else {
                                if (value) {
                                    if (value == 'object') {
                                        //for supporting nested tables
                                        tbCon += tdRow.format(ConvertJsonToTableBom(eval(value.data), value.tableId, value.tableClassName, value.linkText));

                                    } else {
                                        tbCon += tdRow.format(value);
                                    }

                                } else {
                                    tbCon += tdRow.format(value = ''); // null = ''
                                }
                            }
                        }
                    }
                    trCon += tr.format(tbCon);
                    tbCon = '';
                }
            }
        }
        tb = tb.format(trCon);
        tbl = tbl.format(th, tb);

        return tbl;
    }
    return null;
}

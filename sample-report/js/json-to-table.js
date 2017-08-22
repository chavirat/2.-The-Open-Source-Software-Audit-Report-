// copyright 2017, Rogue wave software
// developed by Chavirat Burapadecha
/*JavaScript format string function */
String.prototype.format = function() {
    var args = arguments;

    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] :
            '{' + number + '}';
    });
};
String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function search(input_id,table_id,col_index) {
        var input, filter, table, tr, td, i;
        input = document.getElementById(input_id);
        filter = input.value.toUpperCase();
        table = document.getElementById(table_id);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[col_index];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    function clear_filter() {
        document.getElementById("search_bom_package").value = "";
        document.getElementById("search_bom_license").value = "";
        var bom = json_bom;
        var jsonHtmlTable_bom1 = ConvertJsonToTableBom(bom, "bomsort1", "table table-hover");
        document.getElementById("bom_info1").innerHTML = jsonHtmlTable_bom1;
        $("#bomsort1").tablesorter({headers:{5:{sorter: false}}});
        //popover on notes, help
        $('[data-toggle="popover"]').popover();
        var softwaremodel = json_softwaremodel;
        var jsonHtmlTable_softwaremodel2 = ConvertJsonToTableOnclicksoftware(softwaremodel, "softwaremodelinfo2", "table table-striped");
        document.getElementById("softwaremodel_info2").innerHTML = jsonHtmlTable_softwaremodel2;
        var bylicense = json_byLicense;
        var jsonHtmlTable_bylicense2 = ConvertJsonToTableOnclicklicense(bylicense, "bylicenseinfo2", "table table-striped");
        document.getElementById("bylicense_info2").innerHTML = jsonHtmlTable_bylicense2;
    }

function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText) {
    //Patterns for links and NULL value
    var italic = '<i>{0}</i>';
    var link = linkText ? '<a href="{0}" target = "_blank">' + linkText + '</a>' :
        '<a href="{0}" target = "_blank">{0}</a>';

    //Pattern for table
    var idMarkup = tableId ? ' id="' + tableId + '"' :
        '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
        '';

    var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';

    //Patterns for table content
    var th = '<thead>{0}</thead>';
    var tb = '<tbody>{0}</tbody>';
    var tr = '<tr>{0}</tr>';
    var thRow = '<th>{0}</th>';
    var tdRow = '<td>{0}</td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';

    if (parsedJson) {
        var isStringArray = typeof(parsedJson[0]) == 'string';
        var headers;

        // Create table headers from JSON data
        // If JSON data is a simple string array we create a single table header
        if (isStringArray)
            thCon += thRow.format('value');
        else {
            // If JSON data is an object array, headers are automatically computed
            if (typeof(parsedJson[0]) == 'object') {
                headers = array_keys(parsedJson[0]);

                for (i = 0; i < headers.length; i++)
                    thCon += thRow.format(headers[i]);
            }
        }
        th = th.format(tr.format(thCon));

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
                        var value = parsedJson[i][headers[j]];
                        var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

                        if (isUrl) // If value is URL we auto-create a link
                            tbCon += tdRow.format(link.format(value));
                        else {
                            if (value) {
                                if (typeof(value) == 'object') {
                                    //for supporting nested tables
                                    tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                                } else {
                                    tbCon += tdRow.format(value);
                                }

                            } else { // If value == null we format it like PhpMyAdmin NULL values
                                //tbCon += tdRow.format(italic.format(value).toUpperCase());
                                tbCon += tdRow.format(value = ''); // If value == null, it shows nothing
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

function array_keys(input, search_value, argStrict) {
    var search = typeof search_value !== 'undefined',
        tmp_arr = [],
        strict = !!argStrict,
        include = true,
        key = '';

    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return input.keys(search_value, argStrict);
    }

    for (key in input) {
        if (input.hasOwnProperty(key)) {
            include = true;
            if (search) {
                if (strict && input[key] !== search_value)
                    include = false;
                else if (input[key] != search_value)
                    include = false;
            }
            if (include)
                tmp_arr[tmp_arr.length] = key;
        }
    }
    return tmp_arr;
}
function ConvertJsonToTableSummary(parsedJson, tableId, tableClassName,rowNumber){
  var idMarkup = tableId ? ' id="' + tableId + '"' :
      '';

  var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
      '';
  var tbl = '<table ' + idMarkup + classMarkup + '>{0}</table>';
  var trow = '<tr><td>{0}</td><td>{1}</td></tr>';
  var trow_con = '';
  var table = '';
  if(parsedJson){
    var headers = array_keys(parsedJson[0]);

    for (i = 0; i < rowNumber; i++){
      var value = parsedJson[0][headers[i]];
      if(value){
      if (isNaN(value)){
        var num = value;
      }else{
        var num = numberWithCommas(value);
      }
      trow_con += trow.format(headers[i],num);
      }
    }
    table = tbl.format(trow_con);
    return table;
  }
  return null;
}
function Help(info){
  var help = '<a tabindex="0" data-html="true" data-trigger="focus"  data-toggle="popover" title="Help" data-placement="bottom"  data-content="{0}"><img src = "img/help.png"></a>';
  var help_note = info.replace(/\"/g, '').replace(/\n/g, "<br>").replace("<pre>"," ");
  var help_info= help.format(help_note);
  return help_info;
}
function ConvertJsonToTablesoftware(parsedJson, tableId, tableClassName,color){
    var idMarkup = tableId ? ' id="' + tableId + '"' :
        '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
        '';
    var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';
    //var tdLink = '<td><a id="{0}" href="#" onClick="reply_clicksoftware(this.id);return false;">{0}</a></td>';
    var tdFiles = '<td>{0}</td>';
    var tdColor = '<td style="width:20px; height:20px;background-color:{0};"></td>';
    var tr = '<tr>{0}</tr>';
    var thead = '<thead><tr>{0}</tr></thead>';
    var tbody = '<tbody>{0}</tbody>';
    var tdCon = '';
    var trCon = '';
    var thCon = '';
    var color = ['#424094', '#D14524', '#5293AD', '#943235','#F4A416', '#2D9F5F', '#5A3386']; // blue, orange,light blue, red,yellow, green, purple
    var i = 0;
    if(parsedJson){
      for(key in parsedJson){
        var value = parsedJson[key];
        var softwaremodel = value.SoftwareModel;
        var files = value.Files;
        //console.log(files);
        var num = numberWithCommas(files);
        tdCon = tdColor.format(color[i]);
        tdCon += tdFiles.format(softwaremodel);
        tdCon += tdFiles.format(num);
        trCon += tr.format(tdCon);
        i++;
      }
      tbody = tbody.format(trCon);
      var th = '<th></th><th>Software Model</th><th>Files</th>';
      thCon = tr.format(th);
      thCon = thead.format(thCon);
      tbl = tbl.format(thCon, tbody);
      return tbl;
    }
    return null;
  }
  function ConvertJsonToTablelicense(parsedJson, tableId, tableClassName){
    var idMarkup = tableId ? ' id="' + tableId + '"' :
        '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
        '';
    var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';
    //var tdLink = '<td><a id="{0}" href="#" onClick="reply_clicklicense(this.id);return false;">{0}</a></td>';
    var tdFiles = '<td>{0}</td>';
    var tdColor = '<td style="width:20px; height:20px;background-color:{0};"></td>';
    var tr = '<tr>{0}</tr>';
    var thead = '<thead><tr>{0}</tr></thead>';
    var tbody = '<tbody>{0}</tbody>';
    var tdCon = '';
    var trCon = '';
    var thCon = '';
    var color = ['#943235', '#F4A416', '#2D9F5F', '#5A3386','#424094', '#D14524', '#5293AD']; // red, yellow, green, purple,blue, orange,light blue
    var i = 0;
    if(parsedJson){
      for(key in parsedJson){
        var value = parsedJson[key];
        var license_type = value.LicenseType;
        var files = value.Files;
        //console.log(files);
        var num = numberWithCommas(files);
        tdCon = tdColor.format(color[i]);
        tdCon += tdFiles.format(license_type);
        tdCon += tdFiles.format(num);
        trCon += tr.format(tdCon);
        i++;
      }
      tbody = tbody.format(trCon);
      var th = '<th></th><th>License Type</th><th>Files</th>';
      thCon = tr.format(th);
      thCon = thead.format(thCon);
      tbl = tbl.format(thCon, tbody);
      return tbl;
    }
    return null;
  }

function ConvertJsonToTableOnclicksoftware(parsedJson, tableId, tableClassName,color){
  var idMarkup = tableId ? ' id="' + tableId + '"' :
      '';

  var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
      '';
  var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';
  var tdLink = '<td><a id="{0}" href="#" onClick="reply_clicksoftware(this.id,{1},\'{2}\');return false;">{0}</a></td>';
  var tdFiles = '<td>{0}</td>';
  var tdColor = '<td style="width:20px; height:20px;background-color:{0};"></td>';
  var tr = '<tr id="{1}">{0}</tr>';
  var thead = '<thead><tr>{0}</tr></thead>';
  var tbody = '<tbody>{0}</tbody>';
  var tdCon = '';
  var trCon = '';
  var thCon = '';
  var color = ['#424094', '#D14524', '#5293AD', '#943235','#F4A416', '#2D9F5F', '#5A3386']; // blue, orange,light blue, red,yellow, green, purple
  var color_sf_light = ['#d9d8e9', '#f3d0c8', '#dce9ee', '#e9d5d6', '#fcecd0', '#d5ebdf', '#ddd6e6'];
  var i = 0;
  if(parsedJson){
    for(key in parsedJson){
      var link_id = "sf_"+i;
      var value = parsedJson[key];
      var softwaremodel = value.SoftwareModel;
      var files = value.Files;
      //console.log(files);
      var num = numberWithCommas(files);
      tdCon = tdColor.format(color[i]);
      tdCon += tdLink.format(softwaremodel,link_id,color_sf_light[i]);
      tdCon += tdFiles.format(num);
      trCon += tr.format(tdCon,link_id);
      i++;
    }
    tbody = tbody.format(trCon);
    var th = '<th></th><th><a id="SoftwareModel" href="#" onClick="reply_clicksoftware(this.id);return false;">Software Model</a></th><th>Files</th>';
    thCon = tr.format(th);
    thCon = thead.format(thCon);
    tbl = tbl.format(thCon, tbody);
    return tbl;
  }
  return null;
}
function ConvertJsonToTableOnclicklicense(parsedJson, tableId, tableClassName){
  var idMarkup = tableId ? ' id="' + tableId + '"' :
      '';

  var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
      '';
  var tbl = '<table ' + idMarkup + classMarkup + '>{0}{1}</table>';
  var tdLink = '<td><a id="{0}" href="#" onClick="reply_clicklicense(this.id,{1},\'{2}\');return false;">{0}</a></td>';
  var tdFiles = '<td>{0}</td>';
  var tdColor = '<td style="width:20px; height:20px;background-color:{0};"></td>';
  var tr = '<tr id="{1}">{0}</tr>';
  var thead = '<thead><tr>{0}</tr></thead>';
  var tbody = '<tbody>{0}</tbody>';
  var tdCon = '';
  var trCon = '';
  var thCon = '';
  var color = ['#943235', '#F4A416', '#2D9F5F', '#5A3386','#424094', '#D14524', '#5293AD']; // red, yellow, green, purple,blue, orange,light blue
  var color_bl_light = ['#e9d5d6', '#fcecd0', '#d5ebdf', '#ddd6e6', '#d9d8e9', '#f3d0c8', '#dce9ee'];
  var i = 0;
  if(parsedJson){
    for(key in parsedJson){
      var link_id = "bl_"+i;
      var value = parsedJson[key];
      var license_type = value.LicenseType;
      var files = value.Files;
      //console.log(files);
      var num = numberWithCommas(files);
      tdCon = tdColor.format(color[i]);
      tdCon += tdLink.format(license_type,link_id,color_bl_light[i]);
      tdCon += tdFiles.format(num);
      trCon += tr.format(tdCon,link_id);
      i++;
    }
    tbody = tbody.format(trCon);
    var th = '<th></th><th><a id="LicenseType" href="#" onClick="reply_clicklicense(this.id);return false;">License Type</a></th><th>Files</th>';
    thCon = tr.format(th);
    thCon = thead.format(thCon);
    tbl = tbl.format(thCon, tbody);
    return tbl;
  }
  return null;
}

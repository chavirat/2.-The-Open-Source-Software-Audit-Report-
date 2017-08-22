function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function CountArrayLang(new_array_files, package_id, file_num) {
    var view_by_package = '';
    var language_array = [];
    if (!file_num) {
        view_by_package = 'Please see the file list in Open Source Audit Report (OSAR)';
    } else {
        //  arrangement files to new array files
        for (var key in new_array_files) {
            var value = new_array_files[key];
            for (key in value) {
                var packageid = key.replace(".", "-");
                if (packageid == package_id) {
                    var value2 = value[key];
                    var files = value2.files;
                    for (var key in files) {
                        var language = files[key].language;
                        if (!language) {
                            language = "Other";
                        }
                        language_array.push(language);
                    }
                    var counts = {};
                    var new_array_counts = [];
                    for (var i = 0; i < language_array.length; i++) {
                        counts[language_array[i]] = 1 + (counts[language_array[i]] || 0);
                    }
                    // console.log(counts);
                    for (var key in counts) {
                        new_array_counts.push({
                            "name": key,
                            "value": counts[key]
                        });
                    }

                }
            }
        }
    }
    return new_array_counts;
}

function ConvertJsonToTableFiles(new_array_files, package_id, file_num) {
    var view_by_package = '';
    var arr_license = [];
    if (!file_num) {
        view_by_package = 'Please see the file list in Open Source Audit Report (OSAR)';
    } else {
        for (var key in new_array_files) {
            var value = new_array_files[key];
            for (key in value) {
                var packageid = key.replace(".", "-");

                if (packageid == package_id) {
                    var value2 = value[key];
                    var package_name = value2.package;
                    // var package_name = _package_name.replace("\u00ae", "&reg;");
                    var files = value2.files;
                    var fileContent = '';
                    var fileGroup = '';
                    var fileBody = '';
                    for (var key in files) {
                        var path = files[key].path;
                        var clear_path = path.replace('./', '');
                        var filename = files[key].filename;
                        var copyrights = files[key].copyrights;
                        var notes = files[key].notes;
                        var license = files[key].license;
                        arr_license.push(license);
                        var pathfile = clear_path + filename;
                        var filters = ['README', 'NOTICE', 'LICENSE', 'COPYING'];
                        for (var i = 0; i < filters.length; i++) {
                            var ossnotice = pathfile.includes(filters[i]);
                            if (ossnotice) {
                                document.getElementById("search_notice").className = "btn btn-primary btn-sm ";
                            }
                        }

                        if (!copyrights) {
                            var copyrights_icon = "";
                        } else {
                            var clear_copyrights = copyrights.replace('\u2014', '-').replace(/\"/g, '').replace(/\n/g, " ");
                            // console.log(clear_copyrights);
                            var copyrights_format = '<a tabindex="0" data-html="true" data-trigger="focus" data-toggle="popover" title="Copyrights" data-placement="bottom" data-content="{0}"><img class="sm-icon" src = "../img/copyrights.png"></a>';
                            var copyrights_icon = copyrights_format.format(clear_copyrights);
                        }
                        if (!notes) {
                            var notes_icon = "";
                        } else {
                            var clear_notes = notes.replace('\u2014', '-').replace(/\"/g, '').replace(/\n/g, " ");
                            var notes_format = '<a tabindex="0" data-html="true" data-trigger="focus" data-toggle="popover" title="Notes" data-placement="bottom" data-content="{0}"><img class="sm-icon" src = "../img/notes.png"></a>';
                            var notes_icon = notes_format.format(clear_notes);
                        }
                        var fileBodyFormat = '<tr><td>{0}&nbsp;{1}</td><td>{2}</td><td>{3}</td></tr>';
                        fileBody += fileBodyFormat.format(copyrights_icon, notes_icon, license, pathfile);
                    }
                    var file_table = '<table id="file_table" class="table table-striped small_font">{0}{1}</table>';
                    var fileHead = '<thead><tr><th style="width:50px"></th><th style="width:200px">License</th><th>Path/Filename</th></tr></thead>';
                    fileContent = file_table.format(fileHead, fileBody);
                    view_by_package = fileContent;
                }
            }
        }
        var unique_license = arr_license.filter(onlyUnique);
        //if(unique_license.length>1){
          //console.log(unique_license);
          var select_tag = '<select class="form-control input-sm" id ="license_selection" onchange="changeLicense()";><option value="" disabled selected>Select a license option</option>{0}</select>';
          var option_tag = '<option value="{0}">{0}</option>';
          var options = '';
          var select = '';
          for (var k = 0; k < unique_license.length; k++) {
              options += option_tag.format(unique_license[k]);
          }
          select = select_tag.format(options);
          //console.log(select);
          document.getElementById("license_option").innerHTML = select;
        // }
        // var license_value = unique_license[0];
        // document.getElementById("license_option").innerHTML = "License : <b>"+license_value+"</b>";
    }
    return view_by_package;
}

function changeLicense() {
    var selectBox = document.getElementById("license_selection");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    // alert(selectedValue);
    var filter = selectedValue.toUpperCase();
    var table = document.getElementById("file_table");
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function search_notice(table_id, col_index) {
    var input, filter, table, tr, td, i;
    // input = document.getElementById(input_id);
    // filter = input.value.toUpperCase();
    filter = ['README', 'NOTICE', 'LICENSE', 'COPYING'];
    table = document.getElementById(table_id);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[col_index];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter[0]) > -1) {
                tr[i].style.display = "";
            } else {
                if (td.innerHTML.toUpperCase().indexOf(filter[1]) > -1) {
                    tr[i].style.display = "";
                } else {
                    if (td.innerHTML.toUpperCase().indexOf(filter[2]) > -1) {
                        tr[i].style.display = "";
                    } else {
                        if (td.innerHTML.toUpperCase().indexOf(filter[3]) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        }
    }
}

function search_notice2(table_id, col_index) {
    var input, filter, table, tr, td, i;
    filter = ['README', 'NOTICE', 'LICENSE', 'COPYING'];
    table = document.getElementById(table_id);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[col_index];
        if (td) {
            var tword = td.innerHTML.toUpperCase();
            if (tword.indexOf(filter[0]) > -1 || tword.indexOf(filter[1]) > -1 || tword.indexOf(filter[2]) > -1 || tword.indexOf(filter[3]) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }

        }
    }
}

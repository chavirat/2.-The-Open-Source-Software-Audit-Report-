<?php
//for the large file, it is possible to run PHP without set memory limits by typing the command below
//php -d memory_limit=-1 index.php <excel filename>
ini_set("memory_limit", "1G");
set_time_limit(0);
// Check incoming arguments
if(count($argv) != 2) {
    die("Usage:\n\t{$argv[0]} <excel-file>\n");
}
require 'vendor/autoload.php';

$inputFileName = $argv[1];
//change the loas number length here
$osar_length = 5;
preg_match('/(?<![0-9])[0-9]{'. $osar_length .'}(?![0-9])/', $inputFileName, $matches);
$osar = $matches[0];

function formatData($data) {
    $headers = $data[0];
    $content = array();
    $i = 0;
    for($i=1, $max = count($data); $i < $max; $i++) {
        $row = $data[$i];
        $content[$i-1] = array();
        foreach($headers as $key => $header) {
            $content[$i-1][$header] = $row[$key];
        }
    }
    return $content;
}
try {
$excelReader = PHPExcel_IOFactory::createReaderForFile($inputFileName);
//read only the tab name below
$worksheets = array('json_summary','json_bom','json_obligations','json_softwaremodel','json_byLicense','json_licenseinfo','json_packageinfo','json_cve','json_files');
$excelReader->setLoadSheetsOnly($worksheets);
$xls = $excelReader->load($inputFileName);
/**  Create a new Reader of the type defined in $inputFileType  **/
  //  $xls = PHPExcel_IOFactory::load($inputFileName);
} catch(PHPExcel_Reader_Exception $e) {
    die('Error loading file: '.$e->getMessage());
}
$sheets = $xls->getAllSheets();
// extract data from the selected sheets
if(count($sheets)) {
    mkdir("../report/data");
    $index = 0;
    foreach($sheets as $sheet) {
        echo "created ".$osar. $sheet->getTitle()."\n";
        // Removes special chars.
        //$data = preg_replace('/[^A-Za-z0-9\-]/', '', $data);
        $data = $sheet->toArray();
        $data = formatData($data);
        //$data = clean($data);
        $var_json = $sheet->getTitle();
        $jsonData = json_encode($data);
        $jsonData_var = 'var '.$var_json.' = '.$jsonData;
        if($jsonData == false) {
            die("Unable to extract data for sheet:".$sheet->getTitle());
        }
        file_put_contents('../report/data/'.$osar.$sheet->getTitle().'.js', $jsonData_var);
        $index++;

    }
}
$index = 'index.html';
$html=file_get_contents($index);
preg_match_all('/data(.)json/', $html, $jsons);
$new_json = 'data/'.$osar.'json';
$add_json = str_replace($jsons[0],$new_json,$html);
preg_match_all('/data(.)OSAReport/',$html, $report);
$new_report = 'data/'.$osar.'OSAReport';
$add_report = str_replace($report[0],$new_report,$add_json);
preg_match_all('/data(.)CVEReport/',$html, $cvereport);
$new_cvereport = 'data/'.$osar.'CVEReport';
$add_cvereport = str_replace($cvereport[0],$new_cvereport,$add_report);
$new_index = '../report/'.$osar.'index.html';
copy($index,$new_index);
echo 'create '.$new_index.PHP_EOL;
file_put_contents($new_index,$add_cvereport);

$file = 'file.html';
$filehtml=file_get_contents($file);
preg_match_all('/json_files.js/', $filehtml, $files);
$new_file = $osar.'json_files.js';
$add_file = str_replace($files[0],$new_file,$filehtml);
$new_file = '../report/data/'.$osar.'file.html';
copy($file,$new_file);
echo 'create '.$new_file.PHP_EOL;
file_put_contents($new_file,$add_file);

function clean($string) {
   //$string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
   $string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.

  // return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
 return $string;
}
// Will copy A to B
// overwritting it if necessary
//copy('json_licenseinfo.js', '../report/data/json_licenseinfo.js');
//echo "copied json_licenseinfo.js to data folder \n";
//copy('json_packageinfo.js', '../report/data/json_packageinfo.js');
//echo "copied json_packageinfo.js to data folder \n";
// extract drawings
// $i=0;
// foreach($sheets as $sheet) {
//     if(count($sheet->getDrawingCollection())) {
//         @mkdir('img');
//         foreach ($sheet->getDrawingCollection() as $drawing) {
//             if ($drawing instanceof PHPExcel_Worksheet_MemoryDrawing) {
//                 ob_start();
//                 call_user_func(
//                     $drawing->getRenderingFunction(),
//                     $drawing->getImageResource()
//                     );
//                 $imageData = ob_get_contents();
//                 ob_end_clean();
//                 $cellID = $drawing->getCoordinates();
//                 file_put_contents('img/'.$i.'_'.$drawing->getName(), $imageData);
//             }
//         }
//     }
//     $i++;
// }
// // extract charts
// $i=0;
// foreach($sheets as $sheet) {
//     if($sheet->getChartCount()  > 0 ){
//         $success = PHPExcel_Settings::setChartRenderer(PHPExcel_Settings::CHART_RENDERER_JPGRAPH,
//                                                        __DIR__.'/vendor/amenadiel/jpgraph/src/');
//         if(!$success) {
//             die('Renderer not set correctly');
//         }
//         @mkdir('img');
//         $charts = $sheet->getChartCollection();
//         foreach ($charts as $chart) {
//             $title = $chart->getTitle();
//             $name = $chart->getName();
//             $caption = $title.'_'.$name;
//             $chart->render('img/'.$i.'_chart_'.$caption.'.jpg');
//         }
//     }
//     $i++;
// }

echo "Done";

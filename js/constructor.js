document.getElementById("upload").addEventListener("change", upload, false);

$(".download").on('click', function(event) {
    // CSV
    var args = [$('table#results'), 'export.csv'];

    exportTableToCSV.apply(this, args);

    // If CSV, don't do event.preventDefault() or return false
    // We actually need this to be a typical hyperlink
});

var messages = $("ol#messages");

function upload(e, t) {

    messages.empty();

    var container = $("#results").find('tbody');

    var linkType = $("select#linkType").val();

    if (linkType == "Select Link Type" || linkType == "MMC") {
        linkPrefix = "cm_mmc"
    } else if (linkType == "Site Promo") {
        linkPrefix = "cm_sp"
    } else if (linkType == "Real Estate") {
        linkPrefix = "cm_re"
    }

    if ($("input#customSwitch1").is(':checked')) {
        linkPrefix = linkPrefix + '_o'
    }

    var data = null;
    var file = e.target.files[0];

    var reader = new FileReader();

    $("label#uploadLabel").text(file.name);

    reader.onload = function(event) {
        var csvData = event.target.result;

        var results = Papa.parse(csvData);

        results.data.forEach(function(d, i) {
            if (d.length != 5) {
                logError(d, "Line has the wrong number of fields", 1);
            } else if (isValidURL(d[0]) === false) {
                logError(d, "First Field of line is not a URL", 2);
            } else {
                if (linkPrefix.startsWith('cm_mmc') == false) (d[4] = null);
                var urlMMC = buildURL(d[0], d[1], d[2], d[3], d[4]);
                container.append($('<tr>')
                    .append($('<td>').text(urlMMC))
                );
            };
        });
    };
    reader.readAsText(file);
    $(".download").removeClass("invisible");
    $("#dvDownload").addClass("bg-success")
};

//https://stackoverflow.com/questions/16078544/export-to-csv-using-jquery-and-html/16203218
function exportTableToCSV($table, filename) {

    var $rows = $table.find('tr:has(td)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function(i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function(j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim) + '"';

    // Deliberate 'false', see comment below
    if (false && window.navigator.msSaveBlob) {

        var blob = new Blob([decodeURIComponent(csv)], {
            type: 'text/csv;charset=utf8'
        });

        // Crashes in IE 10, IE 11 and Microsoft Edge
        // See MS Edge Issue #10396033
        // Hence, the deliberate 'false'
        // This is here just for completeness
        // Remove the 'false' at your own risk
        window.navigator.msSaveBlob(blob, filename);

    } else if (window.Blob && window.URL) {
        // HTML5 Blob        
        var blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8'
        });
        var csvUrl = URL.createObjectURL(blob);

        $(this)
            .attr({
                'download': filename,
                'href': csvUrl
            });
    } else {
        // Data URI
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
                'download': filename,
                'href': csvData,
                'target': '_blank'
            });
    }
}


function buildURL(u, v, c, p, i) {
    if (linkPrefix.endsWith("_o")) {
        v = ceaserCipher(v.trim());
        c = ceaserCipher(c.trim());
        p = ceaserCipher(p.trim());
        if (linkPrefix.startsWith('cm_mmc')) {
            i = ceaserCipher(i.trim());
        };
    } else {
        v = v.trim();
        c = c.trim();
        p = p.trim();
        if (linkPrefix.startsWith('cm_mmc')) {
            i = i.trim();
        };
    };

    //create [cm_mmc|cm_mmc0]=v-_-c-_-p-_-i string
    var fullMarketingLink = [v, c, p].join('-_-');
    if (linkPrefix.startsWith('cm_mmc')) {
        fullMarketingLink = [fullMarketingLink, i].join('-_-');
    };

    var url = new URL(u);

    url.searchParams.append(linkPrefix, fullMarketingLink);

    //We want the url unencoded to prevent issues if it is usedin other things later
    finalURL = decodeURIComponent(url);

    return finalURL;

};

//https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/43467144

function isValidURL(str) {
    var a = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
}

function logError(l, errorMsg, severity) {
    var $error = $("<li>").html(errorMsg + "<br>" + l);

    if (severity === 1) {
        $error.addClass("list-group-item list-group-item-danger")
    } else {
        $error.addClass("list-group-item list-group-item-warning")
    }

    messages.append($error)

    return true
}

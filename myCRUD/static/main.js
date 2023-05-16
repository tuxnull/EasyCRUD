
function addQueryAlert(alert, severity = "warning"){
    let query_alerts = document.getElementById("alert_field");
    let alert_elm = document.createElement("div");
    alert_elm.className = "alert alert-"+severity+" alert-dismissible fade show";
    alert_elm.setAttribute("role", "alert");
    alert_elm.innerHTML = '<p>' + alert + '</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    query_alerts.appendChild(alert_elm);

    setTimeout(function(){
        alert_elm.remove();
    }, 15000);

}

function executeSQLInView(query){
    let query_textbox = document.getElementById("query_input");
    let table = document.getElementById("data_table");
    let query_info = document.getElementById("query_info");
    executeSQL(query, function(response, res_obj){
        try{
            let data = {"0": ["No data returned."]};
            query_info.innerHTML = "Query executed successfully. ";
            if(res_obj.response != "[]"){
                data = JSON.parse(response);
                query_info.innerHTML = "Query executed successfully. " + (data.length - 1) + " rows returned.";
            }
            let html = "<thead><tr>";
            for(i = 0; i < data[0].length; i++){
                html += "<th>" + data[0][i] + "</th>";
            }
            html += "</tr></thead><tbody class='table-group-divider'>";
            for(i = 1; i < data.length; i++){
                html += "<tr>";
                for(j = 0; j < data[i].length; j++){
                    html += "<td>" + data[i][j] + "</td>";
                }
                html += "</tr></tbody>";
            }
            table.innerHTML = html;
            query_textbox.value = query;
        } catch (e) {
            console.log(e);
            console.log(res_obj);
            addQueryAlert(res_obj.response, "danger");
        }
    });
}

function executeSQL(query, callback){
    let data = new URLSearchParams({
        query: query
    });
    postAsync("/api/executeSQL", data, function(response){
        callback(response.responseText, response);
    });
}

// ------

function getAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
            callback(xmlHttp);
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function postAsync(url, data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
            callback(xmlHttp);
        }
    }
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send(data);
}

// ------

function loadDatabases(){
    executeSQL("SHOW DATABASES", function(response){
        let databases = JSON.parse(response);
        
        let database_list = document.getElementById("db_list");
        database_list.innerHTML = "";

        for(i = 1; i < databases.length; i++){
            let database = databases[i][0];

            let database_obj = document.createElement("a");
            database_obj.className = "list-group-item";
            database_obj.innerHTML = "";
            database_obj.id = "sel-" + database;

            let database_table_btn = document.createElement("button");
            database_table_btn.className = "btn btn-link dropdown-toggle dropdown-toggle-split";
            database_table_btn.innerHTML = '<span class="visually-hidden">View Tables</span>';
            database_table_btn.setAttribute("data-bs-toggle", "collapse");
            database_table_btn.setAttribute("href", "#collapse-" + database);
            database_table_btn.setAttribute("role", "button");
            database_table_btn.setAttribute("aria-expanded", "false");
            database_table_btn.innerHTML = database;
            database_obj.appendChild(database_table_btn);

            database_table_btn.onclick = function(){
                loadTables(database);
            }

            database_list.appendChild(database_obj);
        }
    });
}

function loadTables(database){

    if(document.getElementById("collapse-" + database) !== null){
        return;
    }

    executeSQL("SHOW TABLES FROM " + database, function(response){
        let tables = JSON.parse(response);
        
        let database_sel = document.getElementById("sel-" + database);

        let table_list = document.createElement("div");
        table_list.innerHTML = "";
        table_list.id = "collapse-" + database;
        table_list.className = "list-group list-group-flush collapse show";
        table_list.style="padding-left: 16px;";
        database_sel.appendChild(table_list);

        for(i = 1; i < tables.length; i++){
            let table = tables[i][0];
            
            let table_obj = document.createElement("a");
            table_obj.className = "list-group-item list-group-item-action";
            table_obj.innerHTML = table;
            table_obj.style = "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;";
            table_obj.id = "sel-" + database + "-" + table;

            table_obj.onclick = function(){
                //TODO: load and show table in main view
                executeSQLInView("SELECT * FROM " + database + "." + table + " LIMIT 100;");
                addQueryAlert("View has been limited to the first 100 rows by default.");
            }

            table_list.appendChild(table_obj);
        }

    });
}

function launchOnStartup() {
    loadDatabases();
}

function viewQueryButtonCallback(){
    let query = document.getElementById("query_input").value;
    executeSQLInView(query);
}



// ------

launchOnStartup();
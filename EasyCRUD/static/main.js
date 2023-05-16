
function executeSQL(query, callback){
    let data = new URLSearchParams({
        query: query
    });
    postAsync("/api/executeSQL", data, function(response){
        callback(response.responseText);
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
            }

            table_list.appendChild(table_obj);
        }

    });
}

function launchOnStartup() {
    loadDatabases();
}



// ------

launchOnStartup();
function handleLogin(){
    
    let username = document.getElementById("username_input").value;
    let password = document.getElementById("password_input").value;

    let data = new URLSearchParams({
        username: username,
        password: password
    });

    postAsync("/api/login", data, function(response){
        if(response.status == 200){
            window.location.href = "/";
        }else{
            alert("Invalid username or password");
        }
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
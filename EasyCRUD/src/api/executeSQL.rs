use std::{iter::Map, collections::HashMap};

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_session::Session;
use mysql_common::Value;
use sqlx::{MySqlConnection, Connection, Row, Column, mysql::{MySqlRow, MySqlPoolOptions}, ValueRef, Executor, mysql::MySqlValueRef, MySqlPool};
use crate::middleware::{auth::checkSessionAuth, settings::getConfig};
use serde::Deserialize;
use futures::{TryStreamExt, StreamExt};
use std::fmt::Display;

#[derive(Deserialize)]
pub struct SQLData {
    query: String
}

pub async fn selectDatabase(session: Session, form: web::Form<SQLData>) -> impl Responder{
    session.insert("database", form.query.clone()).unwrap();
    HttpResponse::Ok().body("")
}

pub async fn executeSQL(session: Session, form: web::Form<SQLData>) -> impl Responder {

    if !checkSessionAuth(session.clone()) {
        println!("Session is not authenticated!");
        return HttpResponse::Unauthorized().body("Unauthorized - Not logged in");
    }

    let username = session.get::<String>("username").unwrap().unwrap();
    let password = session.get::<String>("password").unwrap().unwrap();
    let database = match session.get::<String>("database"){
        Ok(Some(database)) => database,
        _ => "".to_string()
    };

    let settings = getConfig();

    let host = settings.get_string("mysql.host").unwrap();
    let port = settings.get_int("mysql.port").unwrap();

    let url_strng = format!("mysql://{}:{}@{}:{}/{}", username, password, host, port, database);

    let mut conn = MySqlPool::connect(url_strng.as_str()).await.unwrap();

    let query = form.query.clone();


    let mut cursor = conn.fetch(query.as_str());

    let mut row_count = 0;
    let mut data= Vec::new();

    
    loop { 

        let row = match cursor.try_next().await{
            Ok(row) => row,
            _ => break
        };

        let row = match row{
            Some(row) => row,
            _ => break
        };

        if(row.is_empty()){
            break;
        }
        let columns = row.columns().iter().map(|col| col.name().to_string()).collect::<Vec<_>>();
        let mut values = Vec::new();
        for col_id in 0..columns.len() {
            
            let val_ref = row.try_get_raw(col_id).unwrap();
            let value = match val_ref.is_null() {
                true => "NULL".to_string(),
                false => row.get_unchecked(col_id)
            };

            values.push(value);
        }
        if(row_count == 0){
            data.push(columns);
        }
        data.push(values);
        row_count += 1;
    }

    HttpResponse::Ok().json(data)
    
}
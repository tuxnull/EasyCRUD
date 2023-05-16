# EasyCRUD.rs

!(https://patrick.garske.link/projects/EasyCRUD.jpg "EasyCRUD User Interface")

A Super Lightweight RUST-based CRUD System for managing MySQL Databases

Currently, only browsing (viewing databases, tables and table values) is supported. Adding, editing and deleting will be added in the future. However, you can still use raw SQL queries to do that.

## Installation

### Without Docker 

1. Clone this repository
2. Install Rust (https://www.rust-lang.org/tools/install)
3. Install MySQL (https://dev.mysql.com/downloads/installer/)
4. Run `cargo run` in the project directory
5. Open `http://localhost:8080` in your browser

### With Docker

1. Clone this repository
2. Install Docker (https://docs.docker.com/get-docker/)
3. Run `docker build -t easycrud .` in the project directory
4. Run `docker run -p 8080:8080 easycrud`
5. Open `http://localhost:8080` in your browser

## Usage

1. Open `http://localhost:8080` in your browser
2. Enter your MySQL credentials


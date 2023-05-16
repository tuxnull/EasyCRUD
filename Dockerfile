FROM rust:latest
WORKDIR /usr/src/easycrud.rs
RUN git clone https://github.com/tuxnull/EasyCRUD.rs.git
RUN cd EasyCRUD.rs/EasyCRUD
RUN cargo build --release
CMD ["./target/release/easycrud"]
FROM rust:latest
WORKDIR /usr/src/mycrud
RUN git clone https://github.com/tuxnull/myCRUD.git
RUN cd myCRUD/myCRUD
RUN cargo build --release
CMD ["./target/release/mycrud"]
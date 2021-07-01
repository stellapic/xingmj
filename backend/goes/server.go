package main

import (
	"log"
	"net/http"
)


func main() {


	http.HandleFunc("/json", json)
	http.HandleFunc("/mysql", scan)
	http.HandleFunc("/", h1)
	// Simple static webserver:
	log.Fatal(http.ListenAndServe(":8999", nil))

	// Simple static webserver:
	log.Fatal(http.ListenAndServe(":8989", http.FileServer(http.Dir("/Users/esonwang/vhost/logrocket_env/xingmj/layuiAdmin"))))






}


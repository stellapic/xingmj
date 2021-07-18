package main

import (
	"log"
	"net/http"
	"time"
)

// Working directory
var wd string

func main() {

	http.HandleFunc("/json/", json)
	http.HandleFunc("/mysql", scan)
	http.HandleFunc("/home", h1)

	// Simple static webserver:
	fs := http.FileServer(http.Dir("../../api/backend/web"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// handle templates and layouts
	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		// The "/" pattern matches everything, so we need to check
		// that we're at the root here.
		// if req.URL.Path != "/" {
		// 	log.Printf("req.URL.Path is" + req.URL.Path + ", it's not /")
		// 	http.NotFound(w, req)
		// 	return
		// }
		log.Printf("visit: " + req.URL.String())
		// Working Directory
		// wd, err := os.Getwd()
		// if err != nil {
		// 	log.Fatal(err)
		// }
		// log.Printf("Working directory is : " + wd)
		// log.Printf("request begin " + time.Now().String())
		serveTemplate(w, req)
		log.Printf("request end " + time.Now().String())
	})

	// Start Serve
	log.Fatal(http.ListenAndServe(":8999", nil))

	// Simple static webserver:
	log.Fatal(http.ListenAndServe(":8989", http.FileServer(http.Dir("/Users/esonwang/vhost/logrocket_env/xingmj/layuiAdmin"))))

}

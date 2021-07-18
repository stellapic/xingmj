package main

import "net/http"

func dispatchRequest(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		serveTemplate(w, r)
	}
}

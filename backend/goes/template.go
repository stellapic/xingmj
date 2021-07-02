package main

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

type templateFile struct {
	name    string
	content string
}

func serveTemplate(w http.ResponseWriter, r *http.Request) {

	// we should get request info first
	// and do some logical operation
	// finally, we got a page html partial and render it along with layout files.

	// request path
	log.Printf("full host name, with port: " + r.Host)
	log.Printf("host without port: " + r.URL.Hostname())
	log.Printf(r.URL.Path)

	// pattern is the glob pattern used to find all the template files.
	pattern := filepath.Join("..", "templates", "layouts", "*.html")
	tmpl := template.Must(template.ParseGlob(pattern))

	err := tmpl.ExecuteTemplate(w, "layout", nil)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}

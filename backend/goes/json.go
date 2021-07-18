package main

import (
	"io"
	"net/http"

	jsoniter "github.com/json-iterator/go"
)

type ColorGroup struct {
	ID     int
	Name   string
	Colors []string
	Path   string
}

func json(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Server", "Gofast")
	group := ColorGroup{
		ID:     1,
		Name:   "Reds",
		Colors: []string{"Crimson", "Red", "Ruby", "Maroon"},
		Path:   r.URL.Path,
	}
	bytes, _ := jsoniter.Marshal(group)
	s := string(bytes)
	io.WriteString(w, s)
}

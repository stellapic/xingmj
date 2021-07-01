package main

import (
	"log"
	"net/http"
	"html/template"
)


func h1(w http.ResponseWriter, _ *http.Request) {
        const tpl = `
<!DOCTYPE html>
<html>
        <head>
                <meta charset="UTF-8">
                <title>{{.Title}}</title>
        </head>
        <body>
                {{range .Items}}<div>{{ . }}</div>{{else}}<div><strong>no rows</strong></div>{{end}}
        </body>
</html>`

        check := func(err error) {
                if err != nil {
                        log.Fatal(err)
                }
        }
        t, err := template.New("webpage").Parse(tpl)
        check(err)

        data := struct {
                Title string
                Items []string
        }{
                Title: "My page",
                Items: []string{
                        "My photos",
                        "My blog",
                },
        }

        err = t.Execute(w, data)
        check(err)

}


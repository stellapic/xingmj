package main

import (
	// "database/sql"
	// "io"

	//	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func scan(w http.ResponseWriter, _ *http.Request) {
	db, err := sql.Open("mysql", "xingmj:123456@tcp(xingmj:3306)/xingmj")
	if err != nil {
		panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}
	defer db.Close()

	// Prepare statement for reading data
	stmtOut, err := db.Prepare("SELECT tag_title FROM photo_tag WHERE id = ?")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer stmtOut.Close()

	var tagName string // we "scan" the result in here
	// Query another number.. 2 maybe?
	err = stmtOut.QueryRow(2).Scan(&tagName) // WHERE id = 2

	io.WriteString(w, "The tag name is "+tagName)
}

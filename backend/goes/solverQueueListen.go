package main

import (
    "database/sql"
    // "io"
    "io/ioutil"

    "fmt"
    // "net/http"

    _ "github.com/go-sql-driver/mysql"

    "log"
    "os"
    "runtime"
    "syscall"
    "time"
    "context"
)

var ctx = context.Background()

 
func main() {
    daemon(0, 1)
    for {
        fmt.Println(scan())
        time.Sleep(1 * time.Second)
    }
 
}


func daemon(nochdir, noclose int) int {
    var ret, ret2 uintptr
    var err syscall.Errno

    darwin := runtime.GOOS == "darwin"
 
    // already a daemon
    if syscall.Getppid() == 1 {
        return 0
    }
 
    // fork off the parent process
    ret, ret2, err = syscall.RawSyscall(syscall.SYS_FORK, 0, 0, 0)
    if err != 0 {
        return -1
    }
 
    // failure
    if ret2 < 0 {
        os.Exit(-1)
    }
 
    // handle exception for darwin
    if darwin && ret2 == 1 {
        ret = 0
    }
 
    // if we got a good PID, then we call exit the parent process.
    if ret > 0 {
        os.Exit(0)
    }
 
    /* Change the file mode mask */
    _ = syscall.Umask(0)
 
    // create a new SID for the child process
    s_ret, s_errno := syscall.Setsid()
    if s_errno != nil {
        log.Printf("Error: syscall.Setsid errno: %d", s_errno)
    }
    if s_ret < 0 {
        return -1
    }
 
    if nochdir == 0 {
        os.Chdir("/")
    }
 
    if noclose == 0 {
        f, e := os.OpenFile("/dev/null", os.O_RDWR, 0)
        if e == nil {
            fd := f.Fd()
            syscall.Dup2(int(fd), int(os.Stdin.Fd()))
            syscall.Dup2(int(fd), int(os.Stdout.Fd()))
            syscall.Dup2(int(fd), int(os.Stderr.Fd()))
        }
    }
 
    return 0
}


func scan() (string) {
	b, err := ioutil.ReadFile("/data/secrets/mysql.txt") // just pass the file name
    if err != nil {
        fmt.Print(err)
    }
    connectionStr := string(b)
    fmt.Println(connectionStr)

	db, err := sql.Open("mysql", connectionStr)
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

	return "The tag name is "+tagName
}





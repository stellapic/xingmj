package main

import (
    "database/sql"
    // "io"
    "io/ioutil"

    "fmt"
    // "net/http"

    "log"
    "os"
    "runtime"
    "syscall"
    "time"
    "context"

    jsoniter "github.com/json-iterator/go"
    _ "github.com/go-sql-driver/mysql"
    "github.com/go-redis/redis/v8"

)

const (
    QUEUE_NAME = "queue:solver:done"
    REDIS_ADDR = "localhost:6379"
)

type solverResult struct {
    id int
    status string
    annotatedImage string
    gridImage string
    zoomImage string
    tags []string
    result string
}

var ctx = context.Background()

 
func main() {
    // daemon(0, 1)
    listenRedis()
}

func listenRedis() {
    client := redis.NewClient(&redis.Options{
        Addr: REDIS_ADDR,
        Password: "", // no password set
        DB:       0,  // use default DB
    })
    // lpop
    for {
        lPop := client.LPop(ctx, QUEUE_NAME)
        if lPop.Err() != nil {
            fmt.Println(lPop.Err())
        }
        lPopVal := lPop.Val()
        if lPopVal != "" {
            fmt.Println("message", lPopVal)
            // go handle message
            result := parseJson([]byte(lPopVal))
            result.result = lPopVal
            // ...
            saveToDb(result)
            // fmt.Println(result)
            fmt.Println("id ", result.id, "work done.")
        }
        // should use goroutine.
        time.Sleep(1 * time.Second)
    }
}


func saveToDb(result solverResult) (string) {
    b, err := ioutil.ReadFile("/data/secrets/mysql.txt") // just pass the file name
    if err != nil {
        fmt.Print(err)
    }
    connectionStr := string(b)
    fmt.Println(connectionStr)

    db, err := sql.Open("mysql", connectionStr) // "xingmj:123456@tcp(xingmj:3306)/xingmj"
    if err != nil {
        panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
    }
    defer db.Close()

    // Prepare statement for reading data
    stmtOut, err := db.Prepare("SELECT image FROM photo WHERE id = ?")
    if err != nil {
        panic(err.Error()) // proper error handling instead of panic in your app
    }
    defer stmtOut.Close()

    var json = jsoniter.ConfigCompatibleWithStandardLibrary
    var tagName string // we "scan" the result in here
    // Query another number.. 2 maybe?
    err = stmtOut.QueryRow(result.id).Scan(&tagName) // WHERE id = 2

    fmt.Println("image: ", tagName)

    //-------5、修改数据--------  
    tagsJson, _ := json.Marshal(result.tags)
    result2, err := db.Exec("update photo set solver_result=?,graph_resolve=?,graph_position=?,graph_zoom=?,tags_solver=?,update_at=? where id = ?", result.result, result.annotatedImage, result.gridImage, result.zoomImage, string(tagsJson), time.Now(), result.id)
    if err != nil {  
       fmt.Println("修改数据错误", err)  
       return ""
    }  
    i2, _ := result2.RowsAffected() //受影响行数  
    fmt.Printf("受影响行数：%d \n", i2)

    return "image: "+tagName
}

func parseJson(jsonVal []byte) (solverResult) {
    var json = jsoniter.ConfigCompatibleWithStandardLibrary
    var result map[string]interface{}
    var tags []string
    annotatedImage, gridImage, zoomImage := "", "", ""
    json.Unmarshal(jsonVal, &result)
    // print_map(result)
    // panic("exit")
    id := int(result["id"].(float64))
    status := result["status"].(string)
    if status == "success" {
        // status = "yes we success"
        annotated := result["annotated"].(map[string]interface{})
        for key, value := range annotated {
            if key == "display" {
                annotatedImage = value.(string)
            }
        }
        grid := result["grid"].(map[string]interface{})
        for k, v := range grid {
            if k == "display" {
                gridImage = v.(string)
            }
        }
        zoom := result["zoom"].([]interface {})
        for k, v := range zoom {
            if k == 1 {
                zoomImage = v.(string)
                break
            }
        }
        tagsInterface := result["tags"].([]interface {})
        for _, v := range tagsInterface {
            tags = append(tags, v.(string))
        }
    }
    fmt.Println(id, status, annotatedImage, gridImage, zoomImage, tags)
    return solverResult{
                id:     id,
                status:   status,
                annotatedImage: annotatedImage,
                gridImage:   gridImage,
                zoomImage: zoomImage,
                tags: tags,
            }
    // return id, status, annotatedImage, gridImage
}

func print_map(m map[string]interface{}) {
    for k, v := range m {
        switch value := v.(type) {
        case nil:
            fmt.Println(k, "is nil", "null")
        case string:
            fmt.Println(k, "is string", value)
        case int:
            fmt.Println(k, "is int", value)
        case float64:
            fmt.Println(k, "is float64", value)
        case []interface{}:
            fmt.Println(k, "is an array:")
            for i, u := range value {
                fmt.Println(i, u)
            }
        case map[string]interface{}:
            fmt.Println(k, "is an map:")
            print_map(value)
        default:
            fmt.Println(k, "is unknown type", fmt.Sprintf("%T", v))
        }
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





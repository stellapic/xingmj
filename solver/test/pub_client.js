'use strict'

import IORedis from 'ioredis'
import { setTimeout } from 'timers/promises'

const config = {
    port: 13697,
    host: 'redis-13697.c275.us-east-1-4.ec2.cloud.redislabs.com',
    password: '19810704',
    db: 0,
    enableOfflineQueue: true
}
const pub = new IORedis(config)
const channel = 'queue:sovler:pending'

const images = [
    {'id': 1, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155259okyu8eu8s8bou8kb.jpg'},
    {'id': 2, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155259mbm3h3m3e6z0i0nm.jpg'},
    {'id': 3, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155300tez5x5212ex6hlue.jpg'},
    {'id': 4, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155300yfh4em4c40py39mh.jpg'},
    {'id': 5, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155258o7ukz76xz8wjjnex.jpg'},
    {'id': 6, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/21/155258v3cyofay2yj2icyc.jpg'},
    {'id': 7, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/20/205419si6pzixij8zypr6j.jpg'},
    {'id': 8, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/20/192412zzs7jj25wu3nuas5.jpg'},
    {'id': 9, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/19/210431ae661me1plyezpjj.jpg'},
    {'id': 10, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/16/142003v3yekioodeai6tdy.jpg'},
    {'id': 11, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202106/16/170847m8z2f5zrc58oct42.jpg'},
    {'id': 12, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202105/22/230013rseklmykvt3yyy95.jpg'},
    {'id': 13, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/16/120621nbu9j0q5k3ieucc5.jpg'},
    {'id': 14, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/17/170843w22ng8203ysxstt3.jpg'},
    {'id': 15, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/17/102808muucj8cuuxnv6r7f.jpg'},
    {'id': 16, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/16/230941wjk1zkt14l8rrr5p.jpg'},
    {'id': 17, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/19/014202b3qpz3pmeqgpghn3.jpg'},
    {'id': 18, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/18/212352zrn3kfg9o94gl44o.jpg'},
    {'id': 19, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/15/155331xoqzqr2aaigwg3el.jpg'},
    {'id': 20, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/15/160133au5uyu00079yna0v.jpg'},
    {'id': 21, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/15/003916caxsao5okmg7f2mo.jpg'},
    {'id': 22, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/14/131938eq01tz971qq1gl40.jpg'},
    {'id': 23, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/14/024932vnjp6rhjrh1fuifu.jpg'},
    {'id': 24, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/14/024933l76c4f2kzzuw5hkf.jpg'},
    {'id': 25, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/14/024934xj6ezvt2eevtegzm.jpg'},
    {'id': 26, 'url': 'https://bbs.imufu.cn/data/attachment/forum/202107/14/024935csvpmfzwfvpjssxh.jpg'},
]

let i = 1645
let j = 1
// for (let task of images) {
// while (true) {
    let random = Math.floor(Math.random() * (25 - 0 + 1) ) + 0

    const task = images[11] // random
    
    // let t = Object.assign({}, task)
    // rpoplpush
    task.id = i++
    console.log(task)
    await pub.lpush(channel, JSON.stringify(task))

    // if (t.id === 12) continue

    random = Math.floor(Math.random() * (60 - 1 + 1) ) + 1
    console.log(`sleep ${random} seconds`)
    // await setTimeout(random * 1000)
// }

pub.disconnect()

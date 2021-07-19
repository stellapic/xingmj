'use strict'

export default class utils {
    static ra_degree2hms(ra) {
        if (!ra) {
            throw new Error('ra is null')
        }

        const h = Math.floor(ra / 15)
        const m = ((ra / 15) - h) * 60
        const s = ((((ra / 15) - h) * 60) - Math.floor(m)) * 60

        return `${h}:${m}:${s}`
    }

    static dec_degree2hms(dec) {
        const deg = Math.floor(dec)
        const m = Math.abs(Math.floor((dec - deg) * 60))
        const s = (Math.abs((dec - deg) * 60) - m) * 60

        return `${deg}:${m}:${s}`
    }
}

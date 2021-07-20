'use strict'

export default class Utils {
    /**
     * ra(right ascension) degree to dms format
     * @param float ra
     * @returns string h:m:s
     * @example 299.89066428916937 => 19h 59.56m 33.76s
     */
    static ra_degree2hms(ra) {
        if (!ra) {
            throw new Error('ra is null')
        }

        const h = Math.floor(ra / 15)
        const m = ((ra / 15) - h) * 60
        const s = ((((ra / 15) - h) * 60) - Math.floor(m)) * 60

        return `${h}:${m}:${s}`
    }

    /**
     * dec(declination) degree to dms format
     * @param float dec
     * @returns string d:m:s
     * @example 22.727134563249827 => 22° 43' 37.68"
     */
    static dec_degree2hms(dec) {
        const deg = Math.floor(dec)
        const m = Math.abs(Math.floor((dec - deg) * 60))
        const s = (Math.abs((dec - deg) * 60) - m) * 60

        return `${deg}:${m}:${s}`
    }

    /**
     * sleep
     * @param int ms
     */
     static async sleep(s) {
        // log.info(`sleep ${ms/1000} secnods`)
        await setTimeout(s * 1000)
    }
}

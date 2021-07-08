'use strict'

import AstrometrySolver from '../backend/astrometry/index.js'

export default class SolverFactory {
    constructor() {}

    static getSolver(type='astrometry') {
        return (type === 'astrometry')
            ? AstrometrySolver.getInstance()
            : null
    }
}

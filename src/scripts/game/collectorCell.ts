import { CellTypes } from '../constants'
import { env } from '../env/env'
import { Texture, Sprite } from 'pixi.js'
import { Cell } from './cell'

export class CollectorCell extends Cell {
    static texture = Texture.from('sprites/collectorCell.png')

    cost = 22

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
    constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        super(opts)

        this.type = 'collectorCell'

        this.initSprite()
        Object.assign(this.sprite, spriteOpts)

        this.assign()
    }
    initSprite() {

        this.sprite = new Sprite(CollectorCell.texture)
        env.container.addChild(this.sprite)
    }
    run() {

        
    }
}
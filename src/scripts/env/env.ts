import { MAX_RUNNER_SPEED, NETWORK_OUTPUTS } from '../constants'
import { Game } from '../game/game'
import { Application, Assets, Container, Graphics } from 'pixi.js'
import { Textures } from '../types'
import { ActivationLayers, Input, NeuralNetwork, Output, WeightLayers } from '../neuralNetwork/network'
import { networkManager } from '../neuralNetwork/networkManager'

class Env {

    contextMenu = document.getElementById('contextMenu')

    games: {[ID: string]: Game } = {}
    graphSize = 10
    graphLength = this.graphSize * this.graphSize
    posSize = 8
    IDIndex = 0
    width = this.graphSize * this.posSize
    height = this.graphSize * this.posSize

    settings = {
        networkVisuals: false,
        enableRender: true,
        speed: 1,
        roundTickLimit: 100,
        organismsQuota: 2,
        games: 10,
    }

    stats = {
        generations: 0,
        bestCells: 0,
        bestScore: 0,
        lastReset: 0,
    }

    textures: Textures

    constructor() {


    }
    async init() {

        await this.initSprites()
        networkManager.init()
        this.initNetworks()
        this.initGames()
    }

    private async initSprites() {

        this.textures = {
            'cellMembrane': await Assets.load('sprites/cellMembrane.png'),
            'solarCell': await Assets.load('sprites/solarCell.png'),
            'collectorCell': await Assets.load('sprites/collectorCell.png'),
            'attackerCell': await Assets.load('sprites/attackerCell.png'),
            'gridPos': await Assets.load('sprites/grass.png'),
        }
    }

    private initGames() {
    
        //

        for (let i = 0; i < this.settings.games; i++) {
    
            const game = new Game()
            game.init()
        }
    }

    private findInputs() {

        const inputs  = [
            // General
            new Input('Last energy', [0], ['-1']),
            new Input('Runs left', [0], ['0']),
            new Input('Income', [0], ['1']),
            new Input('Energy', [0], ['2']),
        ]

        // Cells and positions

        for (let x = 0; x < env.graphSize; x += 1) {
            for (let y = 0; y < env.graphSize; y += 1) {

                inputs.push(
                    new Input(x + ', ' + y, [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                    ], 
                    [
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '10',
                        '11',
                    ])
                )
            }
        }

        return inputs
    }

    private initNetworks() {

        const inputs = this.findInputs()

        for (let i = Object.keys(networkManager.networks).length; i < this.settings.organismsQuota; i++) {

            const network = new NeuralNetwork()
            network.init(inputs, NETWORK_OUTPUTS.length)
            network.mutate()
            if (env.settings.networkVisuals) network.createVisuals(inputs, NETWORK_OUTPUTS)
        }
    }

    private cloneNetworks(network: NeuralNetwork) {

        const inputs = this.findInputs()
        
        for (let i = Object.keys(networkManager.networks).length; i < this.settings.organismsQuota; i++) {

            const newNetwork = network.clone()
            newNetwork.mutate()
            if (env.settings.networkVisuals) newNetwork.createVisuals(inputs, NETWORK_OUTPUTS)
        }
    }
    
    newID() {
    
        this.IDIndex += 1
        return this.IDIndex.toString()
    }

    async run() {

        await this.runGames()

        
    }

    async runGames() {

        for (const ID in this.games) {

            this.games[ID].start()
        }


    }

    manualReset() {

        for (const ID in this.games) {

            const game = this.games[ID]

            game.stop()
        }

        this.reset()
    }
    
    reset(winners: Set<string> = new Set()) {

        console.log('reset ---------------')
    
        this.stats.generations += 1

        for (const ID in networkManager.networks) {

            if (winners.has(ID)) continue

            delete networkManager.networks[ID]
        }

        const winnerID = Array.from(winners)[0]
        if (winnerID) {

            const winner = networkManager.networks[winnerID]
            this.cloneNetworks(winner)
        }
        else this.initNetworks()
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
        }
    }

    keyManager(event: Event) {


    }

    clickManager(event: Event) {
        return

        const targetEl = event.target as HTMLElement
        if (targetEl.classList.contains('contextMenuPart')) {

            return
        }

        this.contextMenu.classList.add('spaceHidden')
    }

    onContextMenu(event: Event) {
        return

        event.preventDefault()

        this.contextMenu.classList.remove('spaceHidden')
        this.contextMenu.style.top = (event as any).clientY + Math.abs(document.body.getBoundingClientRect().top) + 'px'
        this.contextMenu.style.left = (event as any).clientX + 'px'
    }
}

export const env = new Env()
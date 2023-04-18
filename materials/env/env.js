

class Env {
    app
    graphics
    gamesAmount = 1

    constructor() {

        this.games = {}
        this.graphSize = 20
        this.graphLength = this.graphSize * this.graphSize
        this.coordSize = 30
        this.searchCount = 1
        this.generationsQuota = 100
        this.IDIndex = 0
        this.width = this.graphSize * this.coordSize
        this.height = this.graphSize * this.coordSize
        this.lastReset = 0
        this.lastFrameTime = new Date()
        this.lastUpdateTime = new Date()

        this.tick = 0
        this.fps = '0'
        this.ups = '0'
        this.roundTick = 0
        this.speed = 1
        this.bestTotalScore = 0
        this.bestGenScore = 0

        this.stats = [
            'tick',
            'roundTick',
            'speed',
            'fps',
            'ups',
            'bestTotalScore',
            'bestGenScore',
        ]
    }
    init() {

        this.initApp()
        this.initContainer()
        this.initGraphics()
        this.initGames()
    }

    initApp() {

        this.app = new PIXI.Application({ 
            background: '#1099bb', 
            width: this.width, 
            height: this.height,
        })
        this.app.view.classList.add('env')
        this.app.view.id = 'env'
        document.getElementById('envParent').appendChild(this.app.view)
    }

    initContainer() {

        this.container = new PIXI.Container()
        this.app.stage.addChild(this.container)
    }
    
    initGraphics() {

        this.graphics = new PIXI.Graphics()
        this.container.addChild(this.graphics)
    }

    initGames() {
    
        //
    
        for (let i = 0; i < this.gamesAmount; i++) {
    
            const game = new Game()
            game.init()
        }
    }
    
    newID() {
    
        return this.IDIndex++
    }

    runFPS() {

        this.fps += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }

        const thisFrameTime = new Date()
        this.fps = (MAX_RUNNER_SPEED / (thisFrameTime - this.lastFrameTime)).toFixed(2)
        this.lastFrameTime = new Date()
    }

    runUPS() {
        
        this.tick += 1
        this.roundTick += 1
    
        let runningGames = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (game.running) runningGames += 1
    
            game.run()
        }
    
        for (const statType of this.stats) {
    
            document.getElementById(statType).innerText = this[statType]
        }
    
        //
    
        if (!runningGames) {
    
            this.reset()
        }

        const thisUpdateTime = new Date()
        this.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date()
    }
    
    reset() {
    
        this.lastReset = this.tick
        this.roundTick = 0
        this.generation += 1
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
            game.init()
        }

        this.container.destroy()
        this.initContainer()
    }
}

const env = new Env()
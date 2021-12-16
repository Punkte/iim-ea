<template>
  <div id="all">
    <h1> Puissance 4</h1>
    <div id="container"></div>
    <form @submit="onSubmit" >
      <label for="col">Colonne: </label>
      <input v-model="userInput" name="col" type="number" min="0" max="6">
    </form>
  </div>
</template>

<script>
import * as Three from 'three'

const player = { color: 0xff0000, name: 'player' }
const bot = { color: 0xffff00, name: 'bot' }

export default {
  name: 'Dijkstra',
  data () {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined,
      tab: null,
      heroPosition: { x: 0, y: 0 },
      userInput: '',
      botInput: ''
    }
  },
  methods: {
    init () {
      let container = document.getElementById('container')
      let tailleTabx = 7
      let tailleTaby = 6
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20)
      this.camera.position.z = 6
      this.camera.position.x = tailleTabx / 2
      this.camera.position.y = tailleTaby / 2

      this.scene = new Three.Scene()
      this.tab = []
      let tile = []
      const geometry = new Three.PlaneGeometry(1, 1)
      const mat = new Three.MeshBasicMaterial({color: 0x0000ff, side: Three.DoubleSide})
      // generation map
      for (let i = 0; i < tailleTabx; i++) {
        this.tab[i] = []
        tile[i] = []
        for (let j = 0; j < tailleTaby; j++) {
          this.tab[i][j] = 0
          tile[i][j] = new Three.Mesh(geometry, mat)
          this.scene.add(tile[i][j])

          tile[i][j].position.x = i
          tile[i][j].position.y = j
        }
      }

      // ------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
      console.table(this.tab)
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    play (scene, colNumber, colortile, playerName) {
      const lastTileIndex = this.tab[colNumber].findIndex(tile => tile === 0)
      if (lastTileIndex < 0) {
        return
      }

      const geometry = new Three.CircleGeometry(0.3, 32)
      const mat = new Three.MeshBasicMaterial({color: colortile, side: Three.DoubleSide})
      const plane = new Three.Mesh(geometry, mat)
      scene.add(plane)
      plane.position.x = colNumber
      plane.position.y = lastTileIndex
      if (playerName === 'player') {
        this.tab[colNumber][lastTileIndex] = 1
      } else if (playerName === 'bot') {
        this.tab[colNumber][lastTileIndex] = -1
      }
      this.verifWin()
    },
    getWinProbability (tile) {
      // horizontal
      // verify if siblings are 0

      // vertical
    },
    onSubmit (e) {
      e.preventDefault()
      this.play(this.scene, +this.userInput, player.color, player.name)

      // const random = Math.floor(Math.random() * 6)
      // get sums of columns
      const sums = []
      for (let i = 0; i < this.tab.length; i++) {
        sums[i] = 0
        for (let j = 0; j < this.tab[i].length; j++) {
          sums[i] = parseInt(sums[i]) + parseInt(this.tab[i][j])
        }
      }
      // get sums of rows
      const sums2 = []
      for (let i = 0; i < this.tab.length; i++) {
        sums2[i] = 0
        for (let j = 0; j < this.tab[i].length; j++) {
          if (!isNaN(this.tab[j][i])) {
            sums2[i] = parseInt(sums2[i]) + parseInt(this.tab[j][i])
          }
        }
      }
      // get max of sums
      const max = Math.max(...sums)
      this.play(this.scene, max, bot.color, bot.name)
    },
    onSubmitBot (e) {
      e.preventDefault()
      this.play(this.scene, +this.botInput, bot.color, bot.name)
    },
    verifWin () {
      // verif horizontal
      for (let i = 0; i < this.tab.length; i++) {
        for (let j = 0; j < this.tab[i].length; j++) {
          if (this.tab[i][j] === 1) {
            if (this.tab[i][j + 1] === 1 && this.tab[i][j + 2] === 1 && this.tab[i][j + 3] === 1) {
              alert('player win')
            }
          } else if (this.tab[i][j] === -1) {
            if (this.tab[i][j + 1] === -1 && this.tab[i][j + 2] === -1 && this.tab[i][j + 3] === -1) {
              alert('bot win')
            }
          }
        }
      }
      // verif vertical
      for (let i = 0; i < this.tab.length; i++) {
        for (let j = 0; j < this.tab[i].length; j++) {
          if (this.tab[i][j] === 1) {
            if (this.tab[i + 1][j] === 1 && this.tab[i + 2][j] === 1 && this.tab[i + 3][j] === 1) {
              alert('player win')
            }
          } else if (this.tab[i][j] === -1) {
            if (this.tab[i + 1][j] === -1 && this.tab[i + 2][j] === -1 && this.tab[i + 3][j] === -1) {
              alert('bot win')
            }
          }
        }
      }

      // verif diagonal
      for (let i = 0; i < this.tab.length; i++) {
        for (let j = 0; j < this.tab[i].length; j++) {
          if (this.tab[i][j] && this.tab[i][j] === 1) {
            if (this.tab[i + 1][j + 1] === 1 && this.tab[i + 2][j + 2] === 1 && this.tab[i + 3][j + 3] === 1) {
              alert('player win')
            }
          } else if (this.tab[i][j] && this.tab[i][j] === -1) {
            if (this.tab[i + 1][j + 1] === -1 && this.tab[i + 2][j + 2] === -1 && this.tab[i + 3][j + 3] === -1) {
              alert('bot win')
            }
          }
        }
      }

      return false
    }

  },
  mounted () {
    this.init()
    this.animate()
  }

}
</script>

<style scoped>
  #container{
    width: 1000px;
    height: 700px;
    margin-left: auto;
    margin-right: auto;
  }

</style>

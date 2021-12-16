<template>
  <div id="all">
    <h1> Dijkstra</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three'
export default {
  name: 'Dijkstra',
  data () {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined,
      tab: null,
      heroPosition: { x: 0, y: 0 }
    }
  },
  methods: {
    init () {
      let container = document.getElementById('container')
      let tailleTab = 16
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20)
      this.camera.position.z = 15
      this.camera.position.x = tailleTab / 2
      this.camera.position.y = tailleTab / 2

      const passed = []

      this.scene = new Three.Scene()
      this.tab = []
      let tile = []
      function HighlightCheckCase (scene, tiletab, colortile) {
        for (let i = 0; i < tiletab.length; i++) {
          const geometry = new Three.PlaneGeometry(0.7, 0.7)
          const mat = new Three.MeshBasicMaterial({color: colortile, side: Three.DoubleSide})
          const plane = new Three.Mesh(geometry, mat)
          scene.add(plane)
          plane.position.x = tiletab[i][0]
          plane.position.y = tiletab[i][1]
        }
      }
      const geometry = new Three.PlaneGeometry(1, 1)
      const terre = new Three.MeshBasicMaterial({color: 0x32CD32, side: Three.DoubleSide})
      const lave = new Three.MeshBasicMaterial({color: 0xed0000, side: Three.DoubleSide})
      // generation map
      for (let i = 0; i < tailleTab; i++) {
        this.tab[i] = []
        tile[i] = []
        for (let j = 0; j < tailleTab; j++) {
          let mat = terre
          this.tab[i][j] = 'terre'
          if (Math.floor(Math.random() * 3) === 0) {
            mat = lave
            this.tab[i][j] = 'lave'
          }
          tile[i][j] = new Three.Mesh(geometry, mat)
          this.scene.add(tile[i][j])
          // console.log(i + "  " +j)
          tile[i][j].position.x = i
          tile[i][j].position.y = j
        }
      }

      // generate key
      let xkey = Math.floor(Math.random() * tailleTab)
      let ykey = Math.floor(Math.random() * tailleTab)
      this.tab[xkey][ykey] = 'key'
      tile[xkey][ykey].material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide})

      // generation hero
      let x = xkey
      let y = ykey
      while (x === xkey && y === ykey) {
        x = Math.floor(Math.random() * tailleTab)
        y = Math.floor(Math.random() * tailleTab)
      }
      this.tab[x][y] = 'Hero'
      this.heroPosition = { x, y }
      tile[x][y].material = new Three.MeshBasicMaterial({color: 0xf4fefe, side: Three.DoubleSide})
      // ------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
      console.table(this.tab)
      const isLava = (x, y) => this.tab[x][y] === 'lave'
      const isKey = (x, y) => this.tab[x][y] === 'key'
      const isValid = (x, y) => x >= 0 && x < tailleTab && y >= 0 && y < tailleTab
      const isInPassed = (x, y) => passed.includes(`${x}-${y}`)
      let found = false
      let counter = {x: 0}

      const checkIndex = (x, y) => {
        const top = y + 1
        const bottom = y - 1
        const left = x - 1
        const right = x + 1
        if (isKey(x, y)) {
          found = true
          console.log(`found key in ${x}-${y}`)
          return
        }
        if (found) {
          return
        }
        if (isValid(left, y) && !isLava(left, y) && !isInPassed(left, y)) {
          HighlightCheckCase(this.scene, [[left, y]], 0xff00ff)
          counter.x++
          passed.push(`${left}-${y}`)
          checkIndex(left, y)
        }
        if (isValid(right, y) && !isLava(right, y) && !isInPassed(right, y)) {
          HighlightCheckCase(this.scene, [[right, y]], 0xff00ff)
          counter.x++
          passed.push(`${right}-${y}`)
          checkIndex(right, y)
        }
        if (isValid(x, top) && !isLava(x, top) && !isInPassed(x, top)) {
          HighlightCheckCase(this.scene, [[x, top]], 0xff00ff)
          counter.x++
          passed.push(`${x}-${top}`)
          checkIndex(x, top)
        }
        if (isValid(x, bottom) && !isLava(x, bottom) && !isInPassed(x, bottom)) {
          HighlightCheckCase(this.scene, [[x, bottom]], 0xff00ff)
          counter.x++
          passed.push(`${x}-${bottom}`)
          checkIndex(x, bottom)
        }
      }

      const checkEdges = (x, y) => {
        const left = x - 1
        const bottom = y - 1
        const right = x + 1
        const top = y + 1

        if (found) {
          return
        }

        if (isKey(x, y)) {
          passed.push(`${x}-${y}`)
          found = true
          console.log('found')
          return
        }

        // check left
        if (isValid(left, y) && !isLava(left, y) && !isInPassed(left, y)) {
          HighlightCheckCase(this.scene, [[left, y]], 0xff00ff)
          counter.x++
          passed.push(`${left}-${y}`)
          checkEdges(left, y)
        }
        // check right
        if (isValid(right, y) && !isLava(right, y) && !isInPassed(right, y)) {
          HighlightCheckCase(this.scene, [[right, y]], 0xff00ff)
          counter.x++
          passed.push(`${right}-${y}`)
          checkEdges(right, y)
        }
        // check top
        if (isValid(x, top) && !isLava(x, top) && !isInPassed(x, top)) {
          HighlightCheckCase(this.scene, [[x, top]], 0xff00ff)
          counter.x++
          passed.push(`${x}-${top}`)
          checkEdges(x, top)
        }
        // check bottom
        if (isValid(x, bottom) && !isLava(x, bottom) && !isInPassed(x, bottom)) {
          HighlightCheckCase(this.scene, [[x, bottom]], 0xff00ff)
          counter.x++
          passed.push(`${x}-${bottom}`)
          checkEdges(x, bottom)
        }
      }

      // checkEdges(x, y)
      checkIndex(x, y)
      console.log(counter)
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    moveHero (x, y) {
      const {x: oldX, y: oldY} = this.heroPosition
      this.tab[oldX][oldY] = 'terre'
      this.tab[x][y] = 'Hero'
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

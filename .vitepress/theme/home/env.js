import * as THREE from 'three'

/* ============================================================
   Procedural dark studio used for reflections.
   Three tall strip lights + a warm back light + a dim floor
   bounce. No external HDRI, no network.
   ============================================================ */

export function createEnvironment(renderer) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x020306)

  const plane = new THREE.PlaneGeometry(1, 1)
  const meshes = []

  function addStrip({ width, height, color, intensity, x, y, z }) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(plane, material)
    mesh.scale.set(width, height, 1)
    mesh.position.set(x, y, z)
    mesh.lookAt(0, 0, 0)
    scene.add(mesh)
    meshes.push(mesh)
  }

  // Main cool strip, front left.
  addStrip({ width: 1.1, height: 11, color: 0xe8f4ff, intensity: 7.5, x: -4.6, y: 2.4, z: 3.2 })
  // Thin secondary cool strip.
  addStrip({ width: 0.32, height: 8, color: 0x8fd2ff, intensity: 5.0, x: -2.6, y: 1.2, z: 5.4 })
  // Warm strip behind the shard, the source of the orange edge light.
  addStrip({ width: 0.9, height: 7, color: 0xff5a1f, intensity: 5.5, x: 4.8, y: 1.6, z: -3.6 })
  // Overhead softbox.
  addStrip({ width: 6.5, height: 0.9, color: 0xcfe4ff, intensity: 3.2, x: 0.4, y: 7.5, z: 1.2 })
  // Very dim floor bounce.
  addStrip({ width: 7, height: 7, color: 0x172638, intensity: 0.5, x: 0, y: -5.5, z: 0 })

  const pmrem = new THREE.PMREMGenerator(renderer)
  const target = pmrem.fromScene(scene, 0.035)

  pmrem.dispose()
  plane.dispose()

  for (const mesh of meshes) {
    mesh.material.dispose()
  }

  scene.clear()

  return target.texture
}

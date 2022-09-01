import global from '../core/global.js';
import * as THREE from '../three/build/three.module.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';

export default class Spaceship {
    constructor(params) {
        this._gltfscene;
        this._pivotpoint = new THREE.Object3D();
        this._speed = (params['Speed']) ? params['Speed'] : 1;
        this._scale = (params['Scale']) ? params['Scale'] : 1;
        this._position = (params['Position']) ? params['Position'] : [0,0,0];
        this._rotation = (params['Rotation']) ? params['Rotation'] : [0,0,0];

        this._pivotpoint.scale.set(this._scale, this._scale, this._scale);
        this._pivotpoint.position.fromArray(this._position);
        this._pivotpoint.rotation.fromArray(this._rotation);

        this._createMesh(params['Filename']);
    }

    _createMesh(filename) {
        let gltfLoader = new GLTFLoader();
        gltfLoader.load(filename, (gltf) => {
            this._pivotpoint.add(gltf.scene);
        });
    }

    addToScene(parent) {
        parent.add(this._pivotpoint);
    }

    update(timeDelta) {
        if(global.sessionActive) {
            if(global.deviceType == "XR") {
                let controler = global.inputHandler.getXRController("RIGHT", "targetRay");
                this._pivotpoint.rotation.copy(controller.rotation);
            }
            let gamepad = global.inputHandler.getXRGamepad("RIGHT");
            if((gamepad != null && gamepad.buttons[0].pressed)
            || global.inputHandler.isScreenTouched()
            || global.inputHandler.isKeyPressed("Key W"))
            {
                this._pivotpoint.translateZ(-this._speed * timeDelta);
            }
            if(global.inputHandler.isKeyPressed("Key S")) {
                this._pivotpoint.translateZ(this._speed * timeDelta);
            }
            if(global.inputHandler.isKeyPressed("Key D")) {
                this._pivotpoint.translateX(this._speed * timeDelta);
            }
            if(global.inputHandler.isKeyPressed("Key A")) {
                this._pivotpoint.translateX(-this._speed * timeDelta);
            }
        }
    }
}
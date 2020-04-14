import { CanvasTexture } from "three/src/textures/CanvasTexture";
import { ClampToEdgeWrapping } from "three/src/constants";
import { Vector3 } from "three/src/math/Vector3";

import ImprovedNoise from "./improvedNoise";

function generateHeight(width, height) {
  const size = width * height;
  const data = new Uint8Array(size);
  const perlin = new ImprovedNoise();
  let quality = 1;
  const z = Math.random() * 100;

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = ~~(i / width);
      data[i] += Math.abs(
        perlin.noise(x / quality, y / quality, z) * quality * 1.75
      );
    }
    quality *= 5;
  }
  return data;
}

function generateTexture(data, width, height) {
  let context, image, imageData;

  const vector3 = new Vector3(0, 0, 0);

  const sun = new Vector3(1, 1, 1);
  sun.normalize();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  image = context.getImageData(0, 0, width, height);
  imageData = image.data;

  for (let i = 0, j = 0; i < imageData.length; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2];
    vector3.y = 2;
    vector3.z = data[j - width * 2] - data[j + width * 2];
    vector3.normalize();

    const shade = vector3.dot(sun);

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
    imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
  }

  context.putImageData(image, 0, 0);

  // scaled 4x

  const canvasScaled = document.createElement("canvas");
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext("2d");
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5);
    imageData[i] += v;
    imageData[i + 1] += v;
    imageData[i + 2] += v;
  }

  context.putImageData(image, 0, 0);
  return canvasScaled;
}

export default function generateTerrain(width, height) {
  const data = generateHeight(width, height);
  const texture = new CanvasTexture(generateTexture(data, width, height));
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  return {
    data,
    texture,
  };
}

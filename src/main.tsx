import p5 from "p5";
import React, { useState, Fragment } from "react";
import { createRoot } from "react-dom/client";

// Entrypoint code
const rootEl = document.getElementById("p5-root");
if (!rootEl) {
  throw new Error("Cannot find element root #p5-root");
}
main(rootEl);

function myP5(p5: p5) {
  let font: p5.Font;
  let timeMultiplier = .0002;
  let noiseSize = 80;
  let noiseScale = 5;

  // user code goes here
  Object.assign(p5, {
    preload() {
      // can preload assets here...
      font = p5.loadFont(
        new URL("/public/fonts/inconsolata.otf", import.meta.url).href
      );
    },
    setup() {
      p5.createCanvas(300, 300, p5.WEBGL);
      p5.background(0);
        // ...
    },
    draw() {
      let timeMultiplier = parameterStore.timeMultiplier;
      let noiseSize = parameterStore.noiseSize;
      let noiseScale = parameterStore.noiseScale;

      // Instead of clearing, draw a semi-transparent black rectangle
    // that partially obscures previous frames
    p5.push();
    p5.translate(-p5.width/2, -p5.height/2); // Move to top-left in WEBGL mode
    p5.fill(0, 0, 0, 20); // Black with very low opacity
    p5.noStroke();
    p5.rect(0, 0, p5.width, p5.height);
    p5.pop();
    
    // get the current time
    let time = p5.millis() * timeMultiplier;

    // draw a circle by stepping through in radians in small increments
    for (let i = 0; i < 2 * Math.PI; i += 0.005) {
      p5.push();
      let size = Math.min(p5.width, p5.height) / 2.5;
      let xNoise = p5.noise(i * noiseScale, time);
      let yNoise = p5.noise(time, i * noiseScale);
      let x = size * Math.cos(i) + xNoise * noiseSize;
      let y = size * Math.sin(i) + yNoise * noiseSize;
      let noiseOffset = noiseSize / 2;
      p5.translate(x,y);
      p5.noStroke();
      p5.circle(-noiseOffset, -noiseOffset, 3);
      p5.pop();
    }
    },
  } satisfies Pick<typeof p5, "preload" | "setup" | "draw">);
}

function main(rootElement: HTMLElement) {
  new p5(myP5, rootElement);
}



const numericParameterDefs = {
  "timeMultiplier": {
    "min": 0,
    "max": 1,
    "step": 0.001,
    "defaultValue": 0.001,
  },
  "noiseSize": {
    "min": 0,
    "max": 100,
    "step": 1,
    "defaultValue": 80,
  },
  "noiseScale": {
    "min": 0,
    "max": 10,
    "step": 0.1,
    "defaultValue": 5,
  },
}

const initParameterStore = () => { return {
    "timeMultiplier": 0.0002,
    "noiseSize": 80,
    "noiseScale": 5,
  }
}

const parameterStore = initParameterStore()

function TestApp() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");


  const [numericParameters, setNumericParameters] = useState(initParameterStore());
  const numbers = [1,2,3];
  return <div>
    Hello World
    <br/>
    { numbers.map( (n) => <Fragment key={n}><span>{n}</span><br/></Fragment>) }
    <input id="test" type="range" min="0" max="100" value={value} onChange={(e) => {
      console.log(e.target.value, typeof e.target.value);
      setValue(e.target.value);
      
    }} />
    <input id="test2" type="range" min="0" max="100" value={value2} onChange={(e) => {
      console.log(e.target.value, typeof e.target.value);
      setValue2(e.target.value);
      
    }} />
    <input id="test3" type="range" min="0" max="100" value={value3} onChange={(e) => {
      console.log(e.target.value, typeof e.target.value);
      setValue3(e.target.value);
      
    }} />
    <br/>
    { Object.entries(numericParameterDefs).map( ([key,value]) => <div key={key}>
      <label>{key}</label><input type="range" min={value.min} max={value.max} step={value.step} value={numericParameters[key as keyof typeof numericParameters]} onChange={(e) => {
        console.log(e.target.value, typeof e.target.value);
        setNumericParameters({...numericParameters, [key]: e.target.value});
        parameterStore[key as keyof typeof parameterStore] = parseFloat(e.target.value);

      }} /> <span>{numericParameters[key as keyof typeof numericParameters]}</span>
    </div>
    )}
  </div>;
}

const container = document.getElementById("react-root");
if (!container) {
  throw new Error("Cannot find element root #react-root");
}
const root = createRoot(container);
root.render(<TestApp />);

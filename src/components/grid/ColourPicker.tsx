import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import "../../styles/ColourPicker.scss";

export interface ColourPickerProps {
   colour: string;
   setColour: (colour: string) => void;
}

export default function ColourPicker(props: ColourPickerProps) {
   const [isDraggingColour, setIsDraggingColour] = useState(false);

   useEffect(() => {
      (document.getElementsByClassName("selected-colour")[0] as HTMLDivElement).style.backgroundColor = props.colour;
      (document.getElementsByClassName("hex-input")[0] as HTMLInputElement).value = props.colour;
   }, [props.colour]);

   const setColourFromSavedColour = (index: number) => {
      const swatch = (document.getElementsByClassName("swatch-container")[0] as HTMLElement).children[index] as HTMLElement;
      const rgbText = swatch.style.backgroundColor;
      if (rgbText !== "") {
         const rgb = rgbText.replace(/[a-zA-Z\(\)]/g, "").split(", ");
         const hex = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
         props.setColour(hex);
      }
   };

   const saveSwatch = (index: number) => {
      if (isDraggingColour) {
         const swatchContainer = document.getElementsByClassName("swatch-container")[0] as HTMLElement;
         (swatchContainer.children[index] as HTMLElement).style.backgroundColor = props.colour;
      }
   };

   const rgbToHex = (r: number, g: number, b: number): string => {
      return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
   };

   const handleColourDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, init?: boolean) => {
      if (isDraggingColour || init) {
         const colourPickerRect = (document.getElementsByClassName("colour-picker")[0] as HTMLElement).getBoundingClientRect();
         const dragSwatch = document.getElementsByClassName("drag-swatch")[0] as HTMLElement;
         dragSwatch.style.display = "unset";
         dragSwatch.style.backgroundColor = props.colour;
         dragSwatch.style.left = e.pageX - colourPickerRect.left - 15 + "px";
         dragSwatch.style.top = e.pageY - colourPickerRect.top - 15 + "px";
      }
   };

   // need to actually save the swatches in redux or a context
   return (
      <div
         className="colour-picker"
         onMouseUp={() => {
            setIsDraggingColour(false);
            (document.getElementsByClassName("drag-swatch")[0] as HTMLElement).style.display = "none";
         }}
         onMouseMove={(e) => handleColourDrag(e)}
      >
         <div className="top-container">
            <div className="colour-container">
               <div
                  className="selected-colour"
                  onMouseDown={(e) => {
                     setIsDraggingColour(true);
                     handleColourDrag(e, true);
                  }}
               ></div>
               <input type="text" className="hex-input" onChange={(e) => props.setColour(e.target.value)}></input>
            </div>
            <HexColorPicker color={props.colour} onChange={(hex) => props.setColour(hex)} />
         </div>
         <div className="swatch-container">
            {[...Array(20)].map((x, index) => (
               <div className="swatch" onClick={() => setColourFromSavedColour(index)} onMouseUp={() => saveSwatch(index)} key={index}></div>
            ))}
         </div>
         <div className="drag-swatch"></div>
      </div>
   );
}

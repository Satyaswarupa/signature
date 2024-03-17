import React, { useRef, useState } from "react";
import { saveAs } from "file-saver";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "./App.css";

const App = () => {
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(200);
  const [penColor, setPenColor] = useState("black"); // Initial pen color
  const [penSize, setPenSize] = useState(0.5); // Initial pen size (set as thin)
  const signatureRef = useRef();

  const handleDownloadPDF = () => {
    const pdfWidth = 800;
    const pdfHeight = 800; 
  
    const pdf = new jsPDF({
      unit: "px",
      format: [pdfWidth, pdfHeight]
    });
  
    const canvas = signatureRef.current.getTrimmedCanvas();
    const ctx = canvas.getContext("2d");
  
   
    const originalLineWidth = ctx.lineWidth;
    ctx.lineWidth = originalLineWidth * (pdfWidth / canvas.width);
  
    const scaleX = pdfWidth / ctx.canvas.width;
    const scaleY = pdfHeight / ctx.canvas.height;
    const scaleFactor = Math.min(scaleX, scaleY);
  
    const scaledWidth = ctx.canvas.width * scaleFactor;
    const scaledHeight = ctx.canvas.height * scaleFactor;
  
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
  
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      x,
      y,
      scaledWidth,
      scaledHeight
    );
  
    pdf.save("signature.pdf");
  
   
    ctx.lineWidth = originalLineWidth;
  };
  

  const handleDownloadImage = () => {
    const image = signatureRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    saveAs(image, "signature.png");
  };

  const handleErase = () => {
    signatureRef.current.clear();
  };

  const handlePenColorChange = (color) => {
    setPenColor(color);
  };

  const handlePenSizeChange = (e) => {
    setPenSize(parseFloat(e.target.value));
  };

  return (
    <div className="draw">
      <h2>Secure Digital Signatures Made Simple</h2>
      <div className="input-container">
        <label htmlFor="canvasHeight">Height:</label>
        <input
          id="canvasHeight"
          type="number"
          value={canvasHeight}
          onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
        />
        <label htmlFor="canvasWidth">Width:</label>
        <input
          id="canvasWidth"
          type="number"
          value={canvasWidth}
          onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
        />
      </div>
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          border: "1px solid black",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >
        <SignatureCanvas
          ref={signatureRef}
          penColor={penColor}
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            className: "sigCanvas",
          }}
          minWidth={penSize} 
        />
      </div>
      <div className="btn">
        <button onClick={handleDownloadPDF} className="button-85">Download as PDF</button>
        <button onClick={handleDownloadImage} className="button-85">Download as Image</button>
        <button onClick={handleErase} className="button-85">Erase</button>
      </div>
<div className="chose">
<div>
        <label htmlFor="penSize">Pen Size:</label>
        <select id="penSize" onChange={handlePenSizeChange} value={penSize}>
          <option value={0.1}>0.1</option>
          <option value={0.2}>0.2</option>
          <option value={0.3}>0.3</option>
          <option value={0.4}>0.4</option>
          <option value={0.5}>0.5</option>
        </select>
      </div>
      <div>
        <label htmlFor="penColor">Pen Color:</label>
        <select
          id="penColor"
          onChange={(e) => handlePenColorChange(e.target.value)}
          value={penColor}
        >
          <option value="black" style={{ backgroundColor: "black", color: "white" }}>Black</option>
          <option value="blue" style={{ backgroundColor: "blue", color: "white" }}>Blue</option>
          <option value="red" style={{ backgroundColor: "red", color: "white" }}>Red</option>
        </select>
      </div>
</div>
    </div>
  );
};

export default App;

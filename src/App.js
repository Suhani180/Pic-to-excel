import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';  

const App = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleImageUpload = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const processImage = async () => {
    setProcessing(true);
    const result = await Tesseract.recognize(image, 'eng', {
      logger: (m) => console.log(m), 
    });

    const extractedText = result.data.text;
    console.log(extractedText);

    const parsedData = extractedText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split(/\s+/));

    setData(parsedData);
    setProcessing(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(data);  
    const wb = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'table_data.xlsx');  
  };

  return (
    <div>
      <h1>Image Table to Excel Converter</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="uploaded" width="300" />}
      <button onClick={processImage} disabled={!image || processing}>
        {processing ? 'Processing...' : 'Process Image'}
      </button>
      {data.length > 0 && (
        <div>
          <button onClick={exportToExcel}>Export to Excel</button>
          <table border="1">
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;

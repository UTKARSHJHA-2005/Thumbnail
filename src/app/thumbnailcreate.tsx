"use client"
import { useEffect, useRef, useState } from 'react';
import Dropzone from './Dropzone';
import { IoMdArrowBack } from "react-icons/io";
import { removeBackground } from "@imgly/background-removal"
import { inter, domine } from "../app/fonts"
// import { getUrl } from './actions/aws';
// import Recent from './recent';

export default function ThumbnailCreate() {
  const [imagesrc, setimagesrc] = useState<string | null>(null);
  const canva = useRef<HTMLCanvasElement>(null)
  const [processedimagesrc, setprocessedimagesrc] = useState<string | null>(null);
  const [canvasReady, setcanvasReady] = useState(false)
  const [text, setText] = useState("POV")
  const [Font, setFont] = useState<string>("Arial")

  const setSelectImage = (file?: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async (e) => {
        const src = e.target?.result;
        setimagesrc(src as string);
        const blob = await removeBackground(src)
        const processedurl = URL.createObjectURL(blob)
        setprocessedimagesrc(processedurl)
        setcanvasReady(true)
      };
    }
  };
  const drawcomposite = () => {
    if (!canva.current || !canvasReady || !imagesrc || !processedimagesrc) return;
    const ctx = canva.current.getContext('2d')
    if (!ctx) return
    const canvas = canva.current;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let font = 100;
      let select = "Arial";
      switch (Font) {
        case "inter":
          select = inter.style.fontFamily;
          break;
        case "domine":
          select = domine.style.fontFamily;
          break;
      }
      ctx.font = `${"bold"} ${font}px ${select}`;
      const textfont = ctx.measureText(text).width;
      const target = canvas.width * 0.9;
      font *= target / textfont;
      ctx.font = `${"bold"} ${font}px ${select}`;
      ctx.fillStyle = "black";
      ctx.globalAlpha = 1;
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.translate(x, y);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      const fgimg = new Image();
      fgimg.onload = () => {
        ctx.drawImage(fgimg, 0, 0, canvas.width, canvas.height);
      }
      fgimg.src = processedimagesrc;
    }
    img.src = imagesrc;
  }
  const handledownload = () => {
    if (canva.current) {
      const link = document.createElement("a");
      link.download = "image.jpg";
      link.href = canva.current.toDataURL();
      link.click();
      // canva.current.toBlob(async (blob) => {
      //   if (blob) {
      //     try {
      //       const upload = await getUrl()
      //       fetch(upload, {
      //         method: "POST",
      //         body: blob,
      //         headers: {
      //           "Content-Type": "application/json"
      //         },
      //       })
      //       console.log("File Uploaded")
      //     } catch (error) {
      //       console.log(error)
      //     }
      //   }
      // }, "image/jpeg")
    }
  }
  useEffect(() => {
    if (canvasReady) {
      drawcomposite()
    }
  }, [canvasReady])
  return (
    <>
      {imagesrc ? (
        <div className="my-4 flex w-full flex-col items-center gap-3">
          <button
            onClick={async () => {
              setimagesrc(null);
              setprocessedimagesrc(null);
              setcanvasReady(false);
            }} className="flex items-center gap-2 cursor-pointer self-start">
            <IoMdArrowBack className="h-4 w-4" />
            <p className="leading-7">Go back</p>
          </button>
          <canvas
            ref={canva}
            className="max-h-lg h-auto w-full max-w-lg rounded-lg"
          ></canvas>
          <div className="w-full border rounded-lg shadow p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Edit</h2>
            </div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="text" className="text-sm font-medium">Text</label>
                <input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Text in thumbnail"
                  className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="font" className="text-sm font-medium">Font</label>
                <select id="font" value={Font} onChange={(e) => setFont(e.target.value)} className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="arial">Arial</option>
                  <option value="inter">Inter</option>
                  <option value="domine">Domine</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2 mt-4">
              <button className='mt-4 bg-red-700 text-blue-50 w-xl h-xl p-2 cursor-pointer rounded-lg'
                onClick={() => handledownload()}>
                Download
              </button>
              <button
                onClick={drawcomposite}
                className="bg-gray-800 text-white rounded py-2 px-4 text-sm hover:bg-gray-900 transition">
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Want to create One?</p>
          {/* <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" /> */}
          <Dropzone setSelectedImage={setSelectImage} />
          {/* <Recent/> */}
        </div >
      )
      }
    </>
  );
}

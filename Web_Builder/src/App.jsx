import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { RiComputerLine } from "react-icons/ri";
import { FaTabletAlt } from "react-icons/fa";
import { ImMobile2 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { API_KEY } from './helper';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-[10px]">
  <h1 class="text-[30px] font-[700]">Welcome to WebBuilder</h1>
</body>
</html>
    `
  );

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  const downloadCode = () => {
    let filename = "webBuilderCode.html";
    let blob = new Blob([code], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  async function getResponse() {

    if (prompt === "") {
      toast.error("Please eneter a prompt!");
      return;
    };

    setLoading(true);
    const text_prompt = `
You are an expert Frontend Developer and UI/UX Designer. The user will provide a detailed description of the website they want. Based on their description, generate a **fully functional, production-ready website** as a **single HTML file**.

### Output Rules:
- Return the result as **one fenced Markdown code block** with the language tag \`html\`.
- Do **not** include any explanations, comments, or text outside that code block.
- The output must be a **complete and working HTML file**.

---

### Technical Specifications:

1. **Tech Stack**:  
   - **HTML5**  
   - **Tailwind CSS** (via CDN)  
   - **Vanilla JavaScript**  
   - **GSAP** (via CDN)  
   - If any CDN fails or becomes unavailable, automatically use an **alternative CDN** or **inline fallback** to ensure the website remains fully functional and loads quickly.  
   - The final output must always be a **self-contained, working HTML file** without dependency errors.
 

2. **Responsiveness**:  
   - Fully responsive (mobile, tablet, desktop).  
   - Use modern **flexbox** and **grid** layouts.  

3. **Theme & Appearance**:  
   - Default to **Dark Mode** unless Light Mode suits the website better.  
   - Include a **theme toggle button** for switching between dark and light modes.  
   - Use clean typography, smooth gradients, rounded corners, and modern design aesthetics.  

4. **Animations & Interactivity**:  
   - Implement **GSAP-based scroll animations** (fade, slide, parallax, or stagger effects).  
   - Smooth hover effects: scaling, shadow transitions, or gradient shifts.  
   - Sticky **Navbar** with subtle shadow on scroll.  
   - Optional: animated gradient backgrounds or floating decorative elements.  

5. **Visual Design & Aesthetic Quality**:
   - Use **high-quality royalty-free images** from Unsplash via direct links wherever possible.  
   - If suitable images are **not available or fail to load**, use **low-quality placeholder images** instead to maintain the layout.  
   - Ensure that every image source is valid — no broken or missing visuals.  
   - Apply **glassmorphism, soft shadows, or neumorphism** effects where appropriate.  
   - All UI components (cards, buttons, and sections) must appear **modern, balanced, and include smooth hover transitions** for interactivity.  

6. **Page Structure** *(modify based on user’s request)*:  
   - **Navbar**: Logo, navigation links, and theme toggle.  
   - **Hero Section**: Headline, subheadline, CTA button, and background (image or gradient).  
   - **Main Section(s)**: Flexible — could include features, product grid, gallery, blog cards, or other requested content.  
   - **Call to Action (CTA)** section with a clear button.  
   - **Footer**: Include the text — *“Made by Sufyan@2025”*.  

7. **Code Quality Requirements**:  
   - Clean, semantic HTML5 with proper ARIA labels.  
   - Well-indented, modular, and readable structure.  
   - Consistent Tailwind utility usage (avoid redundancy).  

8. **Performance & Optimization**:  
   - No external CSS or JS frameworks beyond Tailwind and GSAP.  
   - Use responsive images (Unsplash or inline SVGs).  
   - Optimize animations for performance and smoothness.

---

### Final Instruction:
Output **only** the single fenced Markdown code block containing the complete HTML file. No explanations, notes, or extra text.

  

Website prompt: ${prompt}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });
    setCode(extractCode(response.text));
    console.log(response.text)
    setLoading(false);
  };


  return (
    <>
      <Navbar />

      <div className="container">
        <h3 className='text-[30px] font-[700]'>Create beautiful websites with <span className='bg-gradient-to-br from-violet-400  to-purple-600 bg-clip-text text-transparent'>WebBuilder</span></h3>
        <p className='mt-2 text-[16px] text-[#b3b3b3]'>Describe your website and <span className='bg-gradient-to-br from-violet-400  to-purple-800 bg-clip-text text-transparent'>AI</span> will code for you.</p>

        <div className="inputBox">
          <textarea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} placeholder='describe your website in detail.'></textarea>
          {
            prompt !== "" ?
              <>
                <i onClick={getResponse} className='sendIcon text-[20px] w-[30px] h-[30px] flex items-center justify-center bg-[#9933ff] rounded-[50%] transition-all duration-300 hover:opacity-[.8]'><MdOutlineArrowUpward /></i>
              </> : ""
          }
        </div>

        <p className='text-[20px] font-[700] mt-[10vh]'>Your <span className='bg-gradient-to-br from-violet-400  to-purple-800 bg-clip-text text-transparent'>AI-Genreated</span> Website will appear here.</p>

        <div className="preview  ">
          <div className="header w-full h-[70px]">
            <h3 className='font-bold text-[16px]'>Live Preview</h3>

            <div className="icons flex items-center gap-[15px]">
              <div onClick={() => { setIsInNewTab(true) }} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">Open in new tab <ImNewTab /></div>
              <div onClick={downloadCode} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">Download <IoMdDownload /></div>
              <div onClick={() => { setIsShowCode(!isShowCode) }} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">{isShowCode ? "Hide Code" : "Show Code"} {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}</div>
            </div>
          </div>

          {
            isShowCode ? <>
              <Editor onChange={(code) => { setCode(code) }} height="100%" theme='vs-dark' defaultLanguage="html" value={code} />
            </> : <>
              {
                loading ?
                  <div className='w-full h-full flex items-center justify-center flex-col'>
                    <FadeLoader color='#9933ff' />
                    <h3 className='text-[23px] mt-4 font-semibold'><span className='bg-gradient-to-br from-violet-400  to-purple-600 bg-clip-text text-transparent'>Generating</span> your website...</h3>
                  </div> :
                  <>
                    <iframe srcDoc={code} className='w-full bg-[white]'></iframe>
                  </>
              }
            </>
          }
        </div>

      </div>


      {
        isInNewTab ?
          <>
            <div className="modelCon">
              <div className="modelBox text-black">
                <div className="header w-full px-[50px] h-[70px] flex items-center justify-between ">
                  <h3 className='font-[700]'>Preview</h3>

                  <div className="icons flex items-center gap-[15px]">
                    <div className="icon"><RiComputerLine /></div>
                    <div className="icon"><FaTabletAlt /></div>
                    <div className="icon"><ImMobile2 /></div>
                  </div>

                  <div className="icons">
                    <div className="icon" onClick={() => { setIsInNewTab(false) }}><IoMdClose /></div>
                  </div>
                </div>
                <iframe srcDoc={code} className='w-full newTabIframe'></iframe>
              </div> 
            </div>
          </> : ""
      }
    </>
  )
}

export default App
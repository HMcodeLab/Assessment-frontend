import React, { useState, useEffect, useRef } from "react";
import { useCodeMirror } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { autocompletion } from "@codemirror/autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { FaCirclePause } from "react-icons/fa6";
const languages = [
  { name: "JavaScript", value: "javascript" },
  { name: "Python", value: "python" },
  { name: "Java", value: "java" },
  { name: "C++", value: "cpp" },
];

const CodeEditor = ({
  Submit,
  codesnippet,
  setcompiledcode,
  Runsampletestcases,
  setlanguage,
  language,
  show,
  setshow,
}) => {
  const [code, setCode] = useState(codesnippet);
  // console.log("adf");

  const editorRef = useRef();
  const onChange = (value) => {
    setCode(value);
    setcompiledcode(value);

    // setcompiledcode(value);
  };

  // Get the language extension based on the selected language
  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return [javascript(), autocompletion()];
      case "python":
        return [python(), autocompletion()];
      case "java":
        return [java(), autocompletion()];

      case "cpp":
        return [cpp(), autocompletion()];
      default:
        return [javascript(), autocompletion()];
    }
  };

  const { setContainer, view } = useCodeMirror({
    container: editorRef.current,
    value: code?.replace(/\\n/g, "\n"), // Convert `\n` to actual newlines
    extensions: getLanguageExtension(),
    theme: dracula,
    onChange: onChange,
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [editorRef.current]);

  useEffect(() => {
    if (view) {
      const defaultCode = codesnippet?.replace(/\\n/g, "\n");
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: defaultCode },
      });
    }
  }, [language, view, codesnippet]);

  const runCode = async () => {
    // setcompiledcode(code);
    // setshow(true)
    await Runsampletestcases();
    // setshow(false)
  };

  return (
    <div className="editor-container h-full w-full bg-black rounded-lg overflow-y-auto scrollclass">
      <div className="language-selector flex justify-between items-center p-2 ">
        <select
          value={language}
          onChange={(e) => {
            const selectedLang = e.target.value;
            console.log(selectedLang);

            setlanguage(selectedLang);
            setCode(`# Write your ${selectedLang} code here`);
          }}
          className="ml-2 p-1 rounded"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.name}
            </option>
          ))}
        </select>

        <div className="flex justify-center items-center gap-3">
          <button
            className="p-2 rounded bg-green-600 text-white hover:bg-green-700 shadow-lg"
            onClick={Submit}
          >
            Submit
          </button>
          <button
            onClick={runCode}
            className="flex items-center p-2 rounded-full h-10 w-10 justify-center bg-white   text-black"
          >
            {!show ? (
              <FontAwesomeIcon className="text-xl" icon={faPlay} />
            ) : (
              <FaCirclePause className="text-3xl" />
            )}
          </button>
        </div>
      </div>

      <div className="editor-section">
        <div
          ref={editorRef}
          style={{ height: "300px", border: "1px solid black" }}
        ></div>
      </div>
    </div>
  );
};

export default CodeEditor;

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MAX_CHAR_LIMIT = 250;

const QuillEditor: React.FC<QuillEditorProps> = ({ content, onChange }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (!quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current!, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        const editorContent = quillInstance.current!.root.innerHTML;
        const plainText = quillInstance.current!.getText(); // Get plain text
        if (plainText.length <= MAX_CHAR_LIMIT) {
          onChange(editorContent);
        } else {
          const truncatedContent = plainText.slice(0, MAX_CHAR_LIMIT);
          quillInstance.current!.setText(truncatedContent); // Set truncated text
        }
      });
    }

    if (quillInstance.current.root.innerHTML !== content) {
      quillInstance.current.root.innerHTML = content;
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
      }
    };
  }, [content, onChange]);

  return (
    <div
      ref={quillRef}
      className="h-[200px] sm:h-[220px] md:h-[260px] text-[#535353] lg:h-[304px] border border-gray-300 bg-white"
      style={{ minHeight: "300px" }}
    ></div>
  );
};

export default QuillEditor;

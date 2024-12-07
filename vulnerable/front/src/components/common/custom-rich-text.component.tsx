import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import { forwardRef, useImperativeHandle, useRef } from "react";

// Create a custom wrapper for RichTextEditor
type CustomRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const CustomRichTextEditor = forwardRef(
  ({ value, onChange, ...props }: CustomRichTextEditorProps, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = useRef<any>(null);

    // Expose the `focus` method to the parent ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (editorRef.current) {
          // Programmatically focus the editor
          editorRef.current.editor.view.focus();
        }
      },
    }));

    return (
      <RichTextEditor
        extensions={[StarterKit]}
        ref={editorRef}
        content={value}
        onUpdate={({ editor }) => onChange(editor.getHTML())}
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        )}
        {...props}
      />
    );
  }
);

export default CustomRichTextEditor;

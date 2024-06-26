import styles from "../text-input/text-input.module.scss";
import TextAreaProps from "./text-area.type";

const TextArea = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  rows,
  cols,
}: TextAreaProps) => {
  return (
    <div className={styles.input__group}>
      <label style={{ fontSize: 18 }} htmlFor={name}>
        {label}
      </label>
      <textarea
        style={{ resize: "none" }}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        cols={cols}
      />
    </div>
  );
};

export default TextArea;

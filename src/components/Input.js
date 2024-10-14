export default function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      className="max-w-[350px] w-full md:text-xl border outline-none placeholder:text-text leading-[18px] border-text px-[15px] py-5 rounded-[11px] text-text"
    />
  );
}

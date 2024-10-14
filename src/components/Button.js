export default function Button(props) {
  const variants = {
    pink: "sm:px-[60px] px-10 sm:py-4 py-[14px] bg-text font-semibold md:text-2xl text-xl text-white rounded-[15px] w-fit border border-text hover:bg-transparent hover:text-text  ",
    white:
      "md:text-lg text-xs text-text font-semibold md:px-4 px-3 py-[10px] flex gap-[10px] bg-white rounded-[10px] shadow-btn hover:bg-text hover:text-white h-fit items-center",
  };
  const pickedVariant = variants[props.variant];
  return (
    <button
      className={`${pickedVariant} `}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

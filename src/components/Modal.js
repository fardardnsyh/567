export default function Modal(props) {
  return (
    <>
      <div
        className="absolute top-0 left-0 grid w-full h-screen p-5  bg-black/30 place-items-center"
        onClick={props.onClose}
      >
        <div className="p-4 max-w-[450px] space-y-2 text-right bg-white text-text rounded-xl">
          <p className="text-left">{props.children}</p>
          <button
            className="px-4 py-2 text-white rounded-md bg-text hover:bg-dark-text"
            onClick={props.onClick}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

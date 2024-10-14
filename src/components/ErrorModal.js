export default function ErrorModal(props) {
  return (
    <>
      <div
        className="absolute top-0 bottom-0 left-0 grid w-full h-screen bg-black/30 place-items-center"
        onClick={props.onClose}
      >
        <div className="p-4 space-y-2 text-right bg-white text-text rounded-xl">
          <p>{props.errorMessage}</p>
          <button
            className="px-4 py-2 text-white rounded-md bg-text hover:bg-dark-text"
            onClick={props.onClick}
          >
            Ok
          </button>
        </div>
      </div>
    </>
  );
}

export default function DeleteButton(props) {
  return (
    <button
      className="px-3 py-2 bg-text border border-text hover:bg-transparent text-sm hover:text-text text-white font-medium"
      onClick={props.onClick}
    >
      Delete
    </button>
  );
}

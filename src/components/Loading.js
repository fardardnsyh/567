export default function Loading(props) {
  return (
    <div className="absolute top-0 left-0 right-0 grid w-full h-screen bg-black/30 place-items-center">
      <div className="p-4 space-y-2 text-right bg-white text-text rounded-xl">
        <p>{props.children}</p>
      </div>
    </div>
  );
}

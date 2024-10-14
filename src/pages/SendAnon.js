import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import ErrorModal from "../components/ErrorModal";
import MaskIcon from "../assets/MaskIcon";
import SendIcon from "../assets/SendIcon";
import Loading from "../components/Loading";

export default function SendAnon() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const date = new Date().getTime();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Secreto | Send Page";
  }, []);

  const handleText = (e) => {
    const formattedText = e.target.value.replace(/\n/g, "<br>");
    setText(formattedText);
  };

  const onSubmit = async () => {
    const username = document.getElementById("username").value;

    if (text === "") {
      setError("errorMessage");
    } else {
      const promiseSendMessage = new Promise((resolve, reject) => {
        setLoading("wait");
        updateDoc(doc(db, "messages", username), {
          [date]: {
            message: text,
            date: date,
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });

      promiseSendMessage
        .then(() => {
          setLoading("finish");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch((error) => {
          if (error.code === "auth/too-many-requests") {
            setError("errorManyrequest");
          }
        });
    }
  };

  const onClose = (e) => {
    if (e.target === e.currentTarget) {
      setError("");
    }
  };

  return (
    <main className="grid h-screen px-5 bg-primary place-items-center">
      <div className="max-w-[800px] w-full rounded-[20px] bg-white shadow text-text">
        <div className="flex items-center border-b border-text justify-between px-7 sm:py-5 py-[10px] gap-5">
          <div className="flex items-center gap-[10px]">
            <MaskIcon />
            <h3 className="hidden text-xl font-bold sm:text-2xl sm:inline">
              Anonymous
            </h3>
          </div>
          <div className="flex gap-4">
            <label htmlFor="username" className="flex-shrink-0 font-medium">
              Send To
            </label>
            <input
              list="userOptions"
              id="username"
              type="text"
              placeholder="Username"
              className="h-fit outline-none placeholder:text-text max-w-[200px] border-b border-text w-full"
              value={"Head Secretor"}
              disabled
            />
          </div>
        </div>
        <div>
          <textarea
            id="myTextarea"
            className="h-[300px] sm:text-xl w-full px-7 py-5 outline-none placeholder:text-text"
            placeholder="Type your message here . . ."
            onChange={handleText}
          ></textarea>
        </div>
        <div className="border-t border-text sm:py-5 sm:px-[38px] py-[10px] px-5 flex justify-between items-center">
          <Link to="/login" className="hover:underline">
            Back to Login
          </Link>

          <button onClick={onSubmit}>
            <SendIcon />
          </button>
        </div>
      </div>
      {loading && (
        <Loading>
          {loading === "wait" && "Please wait"}
          {loading === "finish" && "Message sent"}
        </Loading>
      )}
      {error === "errorMessage" && (
        <ErrorModal
          errorMessage="Type something"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
      {error === "errorManyrequest" && (
        <ErrorModal
          errorMessage="Wait few minutes"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import MaskIcon from "../assets/MaskIcon";
import SendIcon from "../assets/SendIcon";
import ErrorModal from "../components/ErrorModal";
import Loading from "../components/Loading";

export default function Send() {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const date = new Date().getTime();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Secreto | Send Page";

    const temp = [];
    getDocs(collection(db, "users")).then((res) => {
      res.forEach((doc) => {
        temp.push(doc.id);
        setUsers(temp);
      });
    });
  }, []);

  const handleText = (e) => {
    const formattedText = e.target.value.replace(/\n/g, "<br>");
    setText(formattedText);
  };

  const onSubmit = async () => {
    const username = document.getElementById("username").value;

    if (username === "") {
      setError("errorUserBlank");
    } else if (text === "") {
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
            navigate("/");
          }, 1500);
        })
        .catch((error) => {
          if (error.code === "not-found") {
            setError("errorUserNotFound");
            setLoading(false);
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
              required
            />
            <datalist id="userOptions">
              {users.map((user) => {
                return (
                  <span key={user}>
                    <option value={user} />
                  </span>
                );
              })}
            </datalist>
          </div>
        </div>
        <div>
          <textarea
            className="h-[300px] sm:text-xl w-full px-7 py-5 outline-none placeholder:text-text"
            placeholder="Type your message here . . ."
            onChange={handleText}
          ></textarea>
        </div>
        <div className="border-t border-text sm:py-5 sm:px-[38px] py-[10px] px-5 flex justify-between items-center">
          <Link to="/" className="hover:underline">
            Back to Dashboard
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
      {error === "errorUserNotFound" && (
        <ErrorModal
          errorMessage="User not found"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
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
      {error === "errorUserBlank" && (
        <ErrorModal
          errorMessage="Send to who?"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
    </main>
  );
}

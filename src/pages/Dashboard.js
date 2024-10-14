import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import SendIconBtn from "../assets/SendIconBtn";
import Button from "../components/Button";
import Close from "../assets/Close";
import About from "../components/About";
import DropdownDelete from "../components/DropdownDelete";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.title = "Secreto | Dashboard Page";

    const username = currentUser.displayName;
    if (username !== undefined) {
      onSnapshot(doc(db, "messages", username), orderBy("date"), (res) => {
        const temp = [];
        Object.keys(res.data()).map((key) => {
          temp.push({
            message: res.data()[key].message,
            date: key,
          });
          return temp;
        });
        temp.sort((a, b) => b.date - a.date);
        setMessages(temp);
      });
    }
  }, [currentUser.displayName]);

  const handleDeleteMessage = async (id) => {
    await updateDoc(doc(db, "messages", currentUser.displayName), {
      [id]: deleteField(),
    });
  };

  const getTimeAgo = (timestamp) => {
    const current = new Date();
    const previous = new Date(parseInt(timestamp));
    const diff = Math.round((current - previous) / 1000); // Time difference in seconds

    if (diff < 60) {
      return "just now";
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const onClose = (e) => {
    if (e.target === e.currentTarget) {
      setModal(false);
    }
  };

  const createMarkup = (content) => ({ __html: content });

  return (
    <>
      <header className="md:py-14 py-5 md:space-y-0 space-y-[10px] md:flex items-center sm:px-10 px-[15px]">
        <div className="text-center md:w-3/5">
          <h1 className="font-semibold text-text md:text-[40px] text-[32px] sm:px-0 px-5">
            Secret Messages For {currentUser.displayName}
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:w-2/5 md:justify-end md:flex-nowrap ">
          <Button
            variant="white"
            onClick={() => {
              navigate("/sending");
            }}
          >
            <span className="hidden md:block">
              <SendIconBtn />
            </span>
            <span className="md:hidden">
              <SendIconBtn mobile />
            </span>
            Send Message
          </Button>
          <span className="md:hidden ">
            <Button
              variant="white"
              onClick={() => {
                setModal(true);
              }}
            >
              About Secreto
            </Button>
          </span>

          <Button
            variant="white"
            onClick={() => {
              signOut(auth);
            }}
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="md:px-10 px-[15px] pb-10 flex gap-10">
        <div className="w-full space-y-5 md:w-3/5">
          {messages.map((message, index) => {
            return (
              <div
                className="bg-white sm:p-[30px] p-[25px] rounded-[10px] shadow text-text space-y-3 "
                key={message.date}
              >
                <div className="relative flex items-center justify-between">
                  <span className="text-sm sm:text-base">
                    {getTimeAgo(message.date)}
                  </span>
                  <DropdownDelete
                    key={index}
                    onDelete={() => {
                      handleDeleteMessage(message.date);
                    }}
                  />
                </div>
                <p
                  className="md:text-xl sm:text-lg md:leading-[30px] leading-[24px]"
                  dangerouslySetInnerHTML={createMarkup(message.message)}
                ></p>
              </div>
            );
          })}
        </div>
        <aside className="hidden w-2/5 md:block">
          <div className="bg-white p-[30px] rounded-[10px] shadow text-text space-y-3">
            <About />
          </div>
        </aside>
        <div
          className={`${
            modal && "opacity-100 z-50"
          } opacity-0 absolute left-0 top-0 h-screen transition-all ease-out -z-10 bg-black/30 w-full p-5`}
          onClick={onClose}
        >
          <div className="text-text  bg-white shadow rounded-[10px] px-10 py-8 space-y-2 relative">
            <About />
            <button
              className="text-text scale-[120%] origin-center hover:text-dark-text absolute top-3 right-5"
              onClick={() => {
                setModal(false);
              }}
            >
              <Close />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

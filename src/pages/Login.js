import { auth, db } from "../config/firebase";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Mask from "../assets/Mask";
import Button from "../components/Button";
import Input from "../components/Input";
import ErrorModal from "../components/ErrorModal";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.title = "Secreto | Login Page";

    const temp = [];
    getDocs(collection(db, "users")).then((res) => {
      res.forEach((doc) => {
        temp.push(doc.id);
      });
      setUsers(temp);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    if (!users.includes(username)) {
      setError("errorUser");
    } else {
      const promiseGetEmail = new Promise((resolve, reject) => {
        setLoading(true);
        getDoc(doc(db, "users", username))
          .then((res) => {
            if (res.exists()) {
              resolve(res.data().email);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      promiseGetEmail
        .then(async (email) => {
          await signInWithEmailAndPassword(auth, email, password);
        })
        .catch((error) => {
          setLoading(false);

          if (error.code === "auth/wrong-password") {
            setError("errorPassword");
          } else if (error.code === "auth/too-many-requests") {
            setError("errorManyrequest");
          }
        });
    }
  };

  const onClose = (e) => {
    if (e.target === e.currentTarget) {
      setError("");
      setModal(false);
    }
  };

  return (
    <main className="grid h-screen px-5 bg-primary place-items-center sm:p-0">
      <div className="absolute z-0 hidden text-center md:block text-dark-text w-fit top-10">
        <div className="absolute left-[50%] -translate-x-[50%] ">
          <Mask />
        </div>
        <h1 className="sm:text-[96px] font-semibold sm:leading-[96px] text-[64px] leading-[64px] mt-8">
          SECRETO
        </h1>
        <h4 className="font-semibold sm:text-2xl">
          Send your message secretly
        </h4>
      </div>
      <div className="max-w-[640px] relative bg-white rounded-[20px] h-fit sm:px-[60px] sm:py-10 p-[30px] flex flex-col text-text text-center sm:gap-10 gap-[30px]">
        <h2 className="md:text-[48px] text-[32px] font-bold ">Login</h2>
        <form
          className="flex flex-col items-center gap-10"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3 sm:space-y-5">
            <Input placeholder="Username" type="text" />
            <Input placeholder="Password" type="password" />
          </div>
          <div className="space-y-2 sm:hidden">
            <Button variant="pink">Login as Secretor</Button>
            <span className="block">or</span>
            <Button
              type="button"
              variant="pink"
              onClick={() => {
                setModal(true);
              }}
            >
              Anonymus
            </Button>
          </div>
          <div className="items-center hidden gap-5 sm:flex">
            <div className="space-y-2">
              <span className="text-center">Send Message as</span>
              <Button
                type="button"
                variant="pink"
                onClick={() => {
                  setModal(true);
                }}
              >
                Anonymous
              </Button>
            </div>

            <div className="space-y-2">
              <span className="text-center">Login as</span>
              <Button variant="pink" type="submit">
                Secretor
              </Button>
            </div>
          </div>
        </form>
        <span className="text-sm text-text sm:text-base">
          You don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium text-dark-text hover:underline"
          >
            Register here
          </Link>
        </span>
      </div>
      {error === "errorUser" && (
        <ErrorModal
          errorMessage="Username not found"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
      {error === "errorPassword" && (
        <ErrorModal
          errorMessage="Password not match"
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
      {loading && <Loading>Please wait</Loading>}
      {modal && (
        <Modal
          onClose={onClose}
          onClick={() => {
            navigate("/sendanon");
          }}
        >
          Without logging in, you can send message, but you can only send to the
          Head Secretor. If you want to send a message to another user, you have
          to become a user as well. You can{" "}
          <Link to={"/register"} className="text-dark-text hover:underline">
            Register here
          </Link>
          .
        </Modal>
      )}
    </main>
  );
}

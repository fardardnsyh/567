import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import Mask from "../assets/Mask";
import Button from "../components/Button";
import Input from "../components/Input";
import ErrorModal from "../components/ErrorModal";
import Loading from "../components/Loading";

export default function Register() {
  document.title = "Secreto | Register Page";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    const email = e.target[1].value;
    const password = e.target[2].value;

    if (users.includes(username)) {
      setError("errorUser");
    } else {
      const promiseRegister = new Promise((resolve, reject) => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });

      promiseRegister
        .then(async (res) => {
          await updateProfile(res.user, {
            displayName: username,
          });

          await setDoc(doc(db, "users", username), {
            username,
            email,
          });

          await setDoc(doc(db, "messages", username), {});

          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setError("errorEmail");
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
      <div className="absolute z-0 hidden text-center text-dark-text w-fit top-10 md:block">
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
      <div className="max-w-[640px] relative bg-white rounded-[20px] h-fit sm:px-[60px] sm:py-10 p-[30px] flex flex-col text-text text-center sm:gap-10 gap-[30px] shadow">
        <h2 className="md:text-[48px] text-[32px] font-bold ">Register</h2>
        <form
          className="flex flex-col items-center gap-10"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3 md:space-y-5">
            <Input placeholder="Username" type="text" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
          </div>

          <Button variant="pink">Register</Button>
        </form>
        <span className="text-sm text-text md:text-base">
          You have an account yet?{" "}
          <Link
            to="/login"
            className="font-medium text-dark-text hover:underline"
          >
            Login here
          </Link>
        </span>
      </div>

      {error === "errorEmail" && (
        <ErrorModal
          errorMessage="Email already in use"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
      {error === "errorUser" && (
        <ErrorModal
          errorMessage="Username already in use"
          onClick={() => {
            setError("");
          }}
          onClose={onClose}
        />
      )}
      {loading && <Loading>Please wait</Loading>}
    </main>
  );
}

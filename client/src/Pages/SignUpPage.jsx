import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import UseAuth from "../hooks/UseAuth/UseAuth";
import UseAxiosCommon from "../hooks/UseAxiosCommon/UseAxiosCommon";

const SignUpPage = () => {
  const {
    user,
    setUser,
    signInWithGoogle,
    loading,
    setLoading,
    createUser,
    signInWithEmail,
    updateUserProfile,
  } = UseAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const axiosCommon = UseAxiosCommon();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const { email, password, name, photo, confirmPassword,mobile } = data;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password !== confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Password not matched",
        text: "Please enter the same password",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!regex.test(password)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title:
          "Password must contain at least one uppercase letter, one lowercase letter and one number",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    createUser(email, password)
      .then((result) => {
        updateUserProfile(name, photo).then(() => {
          const userData = {
            email: result.user.email,
            name: name,
            password: password,
            mobileNo: mobile,
            photo: photo,
            role: "user",
            status: "active",
          };
          axiosCommon
            .post("/addUsers", userData)
            .then((response) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Account created successfully",
                text: `Welcome ${name}`,
                showConfirmButton: false,
                timer: 1500,
              });
              setUser(result.user);
              navigate("/");
              setLoading(false);
            })
            .catch((error) => {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to save user",
                text: error.message,
                showConfirmButton: false,
                timer: 1500,
              });
            });

          
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Account creation failed",
          text: error.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  const handleGoogleLogin = () => {
     signInWithGoogle()
       .then((result) => {
         const userData = {
           email: result.user.email,
           name: result.user.displayName,
           password: "google login",
           mobileNo: "google login",
           photo: result.user.photoURL,
           role: "user",
           status: "active",
         };
 
         axiosCommon
           .post("/addUsers", userData)
           .then((response) => {
             console.log(response);
             Swal.fire({
               position: "center",
               icon: "success",
               title: "Login Success",
               text: `Welcome ${result.user.displayName}`,
               showConfirmButton: false,
               timer: 1500,
             });
             setUser(result.user);
             navigate("/");
             setLoading(false);
           })
           .catch((error) => {
             Swal.fire({
               position: "center",
               icon: "error",
               title: "Failed to save user",
               text: error.message,
               showConfirmButton: false,
               timer: 1500,
             });
           });
       })
       .catch((error) => {
         Swal.fire({
           position: "center",
           icon: "error",
           title: "Login Failed",
           text: error.message,
           showConfirmButton: false,
           timer: 1500,
         });
         // console.log(error.message);
       });;
   };

  return (
    <div>
      <section className="">
        <div className="flex justify-center min-h-screen">
          <div
            className="hidden bg-cover bg-no-repeat h-screen lg:block lg:w-[50%]"
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/dBHbFjH/sign-removebg-preview.png')",
            }}
          ></div>

          <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-[50%]">
            <div className="w-full">
              <div className="flex justify-center mx-auto">
                <img
                  className="w-auto h-16"
                  src="https://i.ibb.co.com/ScVh51f/logo1-removebg-preview.png"
                  alt=""
                />
              </div>
              <div className="text-center mt-8">
                <h1 className="text-2xl font-semibold tracking-wider  capitalize ">
                  Get your free account now.
                </h1>

                <p className="mt-4 ">
                  Let’s get you all set up so you can verify your personal
                  account and begin setting up your profile.
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center mt-4  transition-colors duration-300 transform border rounded-lg dark:border-gray-700  hover:bg-gray-50 dark:hover:bg-gray-600 w-full "
              >
                <div className="px-4 py-2">
                  <svg className="w-6 h-6" viewBox="0 0 40 40">
                    <path
                      d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                      fill="#1976D2"
                    />
                  </svg>
                </div>

                <span className="w-5/6 px-4 py-3 font-bold text-center">
                  Sign in with Google
                </span>
              </button>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 "
              >
                <div className="">
                  <label className="block mb-2 text-sm  font-bold">Name</label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="John Doe"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600   dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.name && <span>This field is required</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm ">Photo url</label>
                  <input
                    {...register("photo", { required: true })}
                    type="url"
                    placeholder="https://www.example.com"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600  dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.photo && <span>This field is required</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Email address
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="johnsnow@example.com"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600  dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.email && <span>This field is required</span>}
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Mobile Number
                  </label>
                  <input
                    {...register("mobile", { required: true })}
                    type="number"
                    placeholder="Enter your mobile number"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600  dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.mobile && <span>This field is required</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm ">Password</label>
                  <input
                    {...register("password", { required: true })}
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400  border border-gray-200 rounded-lg dark:placeholder-gray-600  dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.password && <span>This field is required</span>}
                </div>

                <div>
                  <label className="block mb-2 text-sm ">
                    Confirm password
                  </label>
                  <input
                    {...register("confirmPassword", { required: true })}
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-800  border border-gray-200 rounded-lg     focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.confirmPassword && (
                    <span>This field is required</span>
                  )}
                </div>

                <div className="md:col-span-2 ">
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    <span className="text-center">Sign Up</span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 rtl:-scale-x-100"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="text-blue-500 text-center my-3">
                Already have an account?
              </div>
              <div className="flex  items-center justify-between mt-4 ">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4 "></span>

                <Link
                  to={"/login"}
                  className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  or login in
                </Link>

                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;

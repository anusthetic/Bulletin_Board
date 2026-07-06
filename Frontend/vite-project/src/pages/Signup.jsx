import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../authSlice";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters."),
  emailId: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      emailId: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-base-300">
        <div className="card-body">

          <h1 className="text-4xl font-bold">Create an Account</h1>

          <p className="text-base-content/70 mb-4">
            Sign up to register for events and more.
          </p>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  First Name
                </span>
              </label>

              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />

              {errors.firstName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.firstName.message}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />

              {errors.emailId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.emailId.message}
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Password
                </span>
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                >
                  
                </button>

              </div>

              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing up...
                </>
              ) : (
                "Sign up"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-base-content/70">
                Already have an account?{" "}
              </span>

              <Link
                to="/login"
                className="link link-primary font-semibold"
              >
                Log in
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
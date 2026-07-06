import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createNotice } from "../api";
import { useState } from "react";

export default function CreateNoticePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category: "general",
      content: "",
    },
  });

  async function onSubmit(data) {
    setServerError("");

    try {
      const res = await createNotice(data);

      navigate(`/notices/${res.id}`, {
        state: { item: res},
      });
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Post a Notice</h1>

          <p className="text-base-content/70 mt-2">
            Publish a notice that will be visible to everyone.
          </p>
        </div>

        {/* Card */}

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">

            {serverError && (
              <div className="alert alert-error mb-4">
                <span>{serverError}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Title */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Title
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Enter notice title"
                  className={`input input-bordered w-full ${
                    errors.title ? "input-error" : ""
                  }`}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Minimum 5 characters",
                    },
                  })}
                />

                {errors.title && (
                  <p className="text-error text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Category
                  </span>
                </label>

                <select
                  className="select select-bordered w-full"
                  {...register("category")}
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="administration">Administration</option>
                  <option value="exam">Exam</option>
                  <option value="hostel">Hostel</option>
                  <option value="placement">Placement</option>
                  <option value="sports">Sports</option>
                  <option value="club">Club</option>
                </select>
              </div>

              {/* Content */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Content
                  </span>
                </label>

                <textarea
                  rows={8}
                  placeholder="Write your notice..."
                  className={`textarea textarea-bordered w-full ${
                    errors.content ? "textarea-error" : ""
                  }`}
                  {...register("content", {
                    required: "Content is required",
                    minLength: {
                      value: 15,
                      message: "Minimum 15 characters",
                    },
                  })}
                />

                {errors.content && (
                  <p className="text-error text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Posting...
                    </>
                  ) : (
                    "Post Notice"
                  )}
                </button>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
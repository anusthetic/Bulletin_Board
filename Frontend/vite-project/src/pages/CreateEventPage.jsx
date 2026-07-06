import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createEvent } from "../api";
import { useState } from "react";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category: "general",
      venue: "",
      organizer: "",
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  const startTime = watch("startTime");

  async function onSubmit(data) {
    setServerError("");

    if (
      data.startTime &&
      data.endTime &&
      new Date(data.startTime) >= new Date(data.endTime)
    ) {
      setServerError("Start time must be before end time.");
      return;
    }

    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        venue: data.venue,
        organizer: data.organizer,
        startTime: new Date(data.startTime).toISOString(),
        endTime: data.endTime
          ? new Date(data.endTime).toISOString()
          : undefined,
      };

      const res = await createEvent(payload);

      navigate(`/event/${res.data.id}`, {
        state: { item: res.data },
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
          <h1 className="text-4xl font-bold">
            Create an Event
          </h1>

          <p className="text-base-content/70 mt-2">
            Students will see this event immediately on the events feed.
          </p>
        </div>

        {/* Card */}

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">

            {serverError && (
              <div className="alert alert-error mb-5">
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
                  placeholder="Enter event title"
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
                  <option value="placement">Placement</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="club">Club</option>
                </select>
              </div>

              {/* Venue */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Venue
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Nalanda Classroom Complex"
                  className="input input-bordered w-full"
                  {...register("venue")}
                />
              </div>

              {/* Date Time */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Starts
                    </span>
                  </label>

                  <input
                    type="datetime-local"
                    className={`input input-bordered w-full ${
                      errors.startTime ? "input-error" : ""
                    }`}
                    {...register("startTime", {
                      required: "Start time is required",
                    })}
                  />

                  {errors.startTime && (
                    <p className="text-error text-sm mt-1">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Ends
                    </span>
                  </label>

                  <input
                    type="datetime-local"
                    min={startTime}
                    className="input input-bordered w-full"
                    {...register("endTime")}
                  />
                </div>

              </div>

              {/* Organizer */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Organizer
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. CSE Department"
                  className="input input-bordered w-full"
                  {...register("organizer")}
                />
              </div>

              {/* Description */}

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Description
                  </span>
                </label>

                <textarea
                  rows={6}
                  placeholder="Describe your event..."
                  className={`textarea textarea-bordered w-full ${
                    errors.description ? "textarea-error" : ""
                  }`}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Minimum 20 characters",
                    },
                  })}
                />

                {errors.description && (
                  <p className="text-error text-sm mt-1">
                    {errors.description.message}
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
                      Creating...
                    </>
                  ) : (
                    "Create Event"
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
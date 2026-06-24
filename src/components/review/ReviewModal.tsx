import { useState } from "react";
import { showError, showSuccess } from "../../utils/toastUtils";
import { createReview } from "../../api/review";
import { ReviewSchema } from "../../validation/reviewSchema";

type ReviewModalProps = {
  appointmentId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReviewModal({
  appointmentId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const result = ReviewSchema.safeParse({
      rating,
      comment,
    });

    if (!result.success) {
      showError(result.error.issues[0].message);
      return;
    }

    try {
      setSubmitting(true);

      await createReview(
        appointmentId,
        rating,
        comment
      );

      showSuccess("Review submitted successfully");

      onSuccess();
    } catch (error: any) {
      showError(
        error?.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Write Review
        </h2>

        <label className="block text-sm font-medium mb-2">
          Rating
        </label>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">
          Comment
        </label>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Share your experience..."
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

<button
  type="button"
  disabled={submitting}
  onClick={handleSubmit}
  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
>
  {submitting
    ? "Submitting..."
    : "Submit Review"}
</button>
        </div>
      </div>
    </div>
  );
}
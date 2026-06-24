import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getDoctorReviews } from "../../api/review"
import { showError } from "../../utils/toastUtils";
import { useAppSelector } from "../../store/hooks";
type Review = {
  reviewId: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
};

export default function DoctorReviewsPage() {
    const { profile } = useAppSelector(
  (state) => state.doctor
);
  const [loading, setLoading] = useState(true);

  const [data, setData] =
    useState<ReviewSummary>({
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
    });

 useEffect(() => {
  if (!profile) return;
  const fetchReviews = async () => {
    try {

      const reviews =
        await getDoctorReviews(
          profile.doctorId
        );

     setData(reviews);

    } catch (error) {
      showError(
        "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchReviews();
}, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Patient Reviews
      </h1>

      {/* SUMMARY CARD */}
      <div className="bg-white rounded-2xl border p-6 mb-8">

        <div className="flex items-center gap-3">

          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />

          <div>
            <h2 className="text-3xl font-bold">
              {data.averageRating.toFixed(1)}
            </h2>

            <p className="text-gray-500">
              {data.totalReviews} Reviews
            </p>
          </div>

        </div>

      </div>

      {/* REVIEW LIST */}
      <div className="space-y-4">

        {data.reviews.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No reviews yet
          </div>
        ) : (
          data.reviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-xl border p-5"
            >
              <div className="flex justify-between items-start">

                <div>
                  <p className="font-semibold">
                    {review.patientName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">

                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />

                  <span className="font-semibold">
                    {review.rating}/5
                  </span>

                </div>

              </div>

              <p className="mt-3 text-gray-700">
                {review.comment}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}
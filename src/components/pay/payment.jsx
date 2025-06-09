import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import LogoBlack from "../../images/Logo-Black.png";
import useUser from "../../hooks/useUser";
import { useMemo } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { FLW_PUBLIC_KEY } from "../../constants/routes";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "../../lib/axios";
import { LoadingAssetBig2 } from "../../assets/assets";
import axios from "axios";

export default function Payment() {
  const { userQuery } = useUser();
  const user = userQuery.data;

  const navigate = useNavigate();
  const { courseId } = useParams();

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ["course-payment", courseId],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await authFetch.get(
        `/api/v1/course/user-courses/${courseId}?brief=true`
      );

      return data;
    }
  });

  const price = useMemo(
    function () {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
      }).format(courseData?.price);
    },
    [courseData?.price]
  );

  const handleFlutterPayment = useFlutterwave({
    public_key: FLW_PUBLIC_KEY,
    tx_ref: `pptlink-${Date.now()}-${user?.id}`,
    amount: courseData?.price,
    currency: "NGN",
    payment_options: "banktransfer",
    customer: {
      email: user?.email,
      name: user?.username
    },
    customizations: {
      title: courseData?.name,
      logo: "https://pptlinks.com/imgs/BLACK.png"
    },
    meta: {
      course_id: courseId,
      user_id: user?.id
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-primaryTwo">
        <LoadingAssetBig2 />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-primaryTwo">
        <p className="text-red-500 font-bold text-lg">
          {axios.isAxiosError(error)
            ? error?.response?.data?.message
            : "An error occurred while fetching the course data."}
        </p>
      </div>
    );
  }

  const handleSubmit = () => {
    handleFlutterPayment({
      callback: () => {
        closePaymentModal(); // this will close the modal programmatically

        navigate(`/course/preview/${courseId}`, { replace: true });
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Pay - ${courseData?.name ?? ""} `}</title>
        <meta
          name="description"
          content="Make your powerpoint presentations payment for a course"
        />
        <meta
          name="tags"
          content={`PPT, Presentations, Powerpoint, PPTLinks, Pay`}
        />

        {/* meta tags to display information on all meta platforms (facebook, instagram, whatsapp) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.PPTLink.com/pay`} />
        <meta property="og:title" content={`Pay - PPTLinks `} />
        <meta
          property="og:description"
          content="Make your powerpoint presentations payment for a course"
        />
        <meta property="og:image" content={LogoBlack} />

        {/* meta tags to display information on twitter  */}
        <meta property="twitter:card" content="website" />
        <meta property="twitter:url" content={`https://www.PPTLink.com/pay`} />

        <meta property="twitter:title" content={`Pay - PPTLinks `} />
        <meta
          property="twitter:description"
          content="Make your powerpoint presentations payment for a course"
        />
        <meta property="twitter:image" content={LogoBlack} />
      </Helmet>
      <div className="min-h-[50vh] py-10 _text-black bg-primaryTwo">
        <div className="container">
          <h1 className="text-3xl maxScreenMobile:text-2xl font-[400] uppercase mb-1">
            {courseData?.name}
          </h1>
          <p className="uppercase text-[#FFA500]">Paid Program</p>
          <p className="text-[0.9rem] pb-3 w-2/5 maxScreenMobile:w-4/5 maxSmallMobile:w-full maxSmallMobile:text-justify">
            {courseData?.description}
          </p>
          <span className="text-[#FFA500] font-bold text-xl">{price}</span>
          <div className="block w-full pt-2">
            {courseData.published && <button
              className="text-xl text-[#FFA500] block w-fit mx-auto border border-[#FFA500] px-10 py-2 rounded-md font-bold maxScreenMobile:w-full"
              onClick={handleSubmit}
            >
              Proceed To payment
            </button>}
          </div>
        </div>
      </div>
    </>
  );
}

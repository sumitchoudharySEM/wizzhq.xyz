import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-5 lg:py-10">
      <div className="rounded-lg p-7 max-w-4xl mx-auto">
        <Link href="/">
          <button
            className="bg-white text-center w-40 rounded-xl h-12 relative text-black text-base font-semibold group mb-5"
            type="button"
          >
            <div className="bg-green-400 rounded-lg h-10 w-1/4 flex items-center justify-center absolute left-1 top-[3px] group-hover:w-[150px] z-10 duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="22px"
                width="22px"
              >
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                ></path>
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                ></path>
              </svg>
            </div>
            <p className="translate-x-1.5">Go Back</p>
          </button>
        </Link>

        <h1 className="text-3xl md:text-4xl text-center font-bold text-[#092917] mb-6">
          Our Privacy Policy
        </h1>
        <p className="text-[19px] leading-6 md:text-xl text-center text-gray-800 mb-2">
          Effective Date: 22 October, 2024
        </p>
        <p className="text-[19px] leading-6 md:text-xl text-center text-gray-800 mb-8">
          Last Updated: 15 November, 2024
        </p>

        <section className="mb-6">
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy outlines how we collect, use, and safeguard your
            personal information when you interact with our platform. By using
            WIZZ, you agree to the practices described in this policy.
          </p>
        </section>

        <hr className="my-8" />

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We collect the following types of information to provide and enhance
            our services:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              Personal Information: When you sign up, we collect personal
              details such as your name, email address, and contact information.
            </li>
            <li>
              Usage Data: We collect information about how you interact with the
              platform, including the pages you visit, the time spent, and other
              similar data.
            </li>
            <li>
              Cookies and Tracking Technologies: We use cookies to track your
              preferences and improve your experience on our website.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We use your information to provide, improve, and personalize your
            experience on our platform. This includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              Providing you with access to features and services of the
              platform.
            </li>
            <li>
              Communicating with you, including sending transactional and
              promotional emails.
            </li>
            <li>
              Improving the functionality and user experience of the platform.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            3. Sharing Your Information
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except in the
            following cases:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              Service Providers: We may share your information with trusted
              service providers who assist in operating our platform or
              providing services to you.
            </li>
            <li>
              Legal Compliance: We may disclose your information when required
              by law or in response to valid legal requests.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            4. Data Security
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We take reasonable precautions to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
            However, no data transmission or storage system is completely
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            5. Your Rights
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            You have the right to access, correct, or delete your personal
            information. If you wish to exercise these rights, please contact us
            using the contact information provided below.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            6. Cookies
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We use cookies to enhance your experience on our platform. Cookies
            are small text files that are stored on your device and allow us to
            recognize your preferences. You can choose to disable cookies
            through your browser settings, but this may affect your experience
            on the platform.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            7. Third-Party Links
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            Our platform may contain links to external websites. WIZZ is not
            responsible for the privacy practices of these third-party sites,
            and we encourage you to review their policies.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            8. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            We reserve the right to update or modify this Privacy Policy at any
            time. When we make changes, we will update the "Last Updated" date
            at the top of this page. We encourage you to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            9. Children's Privacy
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ does not knowingly collect personal information from
            individuals under the age of 13. If you believe a minor has provided
            us with personal data, contact us immediately at the email address
            below.
          </p>
        </section>

        <footer className="text-gray-600 text-[18px] leading-7">
          <p>
            For inquiries, contact us at{" "}
            <a href="mailto:socials.wizz@gmail.com" className="text-blue-500">
              socials.wizz@gmail.com
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

export default page;

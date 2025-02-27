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
            Our Terms & Conditions
          </h1>
        <p className="text-[19px] leading-6 md:text-xl text-center text-gray-800 mb-8">
          Effective Date: 15 November, 2024
        </p>

        <section className="mb-6">
          <p className="text-gray-700 text-[19px] leading-7">
            Welcome to <strong>WIZZ</strong>, your gateway to endless
            opportunities through bounties, projects, hirings, and grants. By
            accessing or using our platform, you agree to abide by these Terms &
            Conditions. Please read them carefully.
          </p>
        </section>

        <hr className="my-8" />

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            By using WIZZ, you confirm that you have read, understood, and agree
            to these Terms & Conditions. If you do not agree, please refrain
            from using our platform.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            2. Platform Overview
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ provides a collaborative platform where:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              <strong>Partners</strong> can list bounties, projects, hirings,
              and grants, set rewards, and evaluate submissions.
            </li>
            <li>
              <strong>Users</strong> can participate in these opportunities and,
              if selected, receive rewards based on the partner's judgment.
            </li>
          </ul>
          <p className="text-gray-700 mt-2  text-[19px] leading-7">
            WIZZ acts solely as a facilitator and does not influence or
            participate in the evaluation or judging process for submissions.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            3. User Responsibilities
          </h2>
          <h3 className="text-[20px] leading-7 font-medium text-gray-800 mt-4">
            3.1 Account Creation:
          </h3>
          <p className="text-gray-700 text-[19px] leading-7 mt-2">
            Users and partners must provide accurate and complete information
            during registration.
          </p>

          <h3 className="text-[20px] leading-7 text-lg font-medium text-gray-800 mt-4">
            3.2 Conduct:
          </h3>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>Use the platform ethically and lawfully.</li>
            <li>
              Avoid any actions that may harm the platform, its users, or its
              reputation.
            </li>
          </ul>

          <h3 className="text-[20px] leading-7 font-medium text-gray-800 mt-4">
            3.3 Submissions:
          </h3>
          <p className="text-gray-700 text-[19px] leading-7 mt-2">
            Users must ensure their submissions are original and do not violate
            any intellectual property or third-party rights. Partners hold sole
            discretion in evaluating submissions and awarding rewards.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            4. Partner Responsibilities
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            Partners must provide clear and accurate information for bounties,
            projects, or other listings, including submission requirements and
            reward details. Judging of submissions and distribution of rewards
            is solely the partner's responsibility.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            5. WIZZ's Role
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ acts as a facilitator and does not:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>Guarantee the quality or outcome of submissions.</li>
            <li>Meditate disputes between users and partners.</li>
            <li>Involve itself in the judging or reward allocation process.</li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            6. Rewards & Payments
          </h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              Rewards will be distributed as specified in the bounty or project
              listing.
            </li>
            <li>
              WIZZ is not responsible for delayed or non-payment of rewards by
              partners.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            7. Intellectual Property
          </h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>
              Users retain ownership of their submissions unless otherwise
              stated in the bounty or project terms.
            </li>
            <li>
              By submitting content, users grant partners a non-exclusive
              license to evaluate their submissions for the purpose of the
              listing.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ is not responsible for:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 text-lg">
            <li>Errors or inaccuracies in listings.</li>
            <li>Actions or decisions made by partners or users.</li>
            <li>
              Losses, damages, or disputes arising from participation in
              bounties, projects, or other opportunities.
            </li>
          </ul>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            9. Termination
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ reserves the right to suspend or terminate accounts for
            violations of these Terms & Conditions.
          </p>
        </section>

        <section className="mb-9">
          <h2 className="text-[22px] leading-8 font-semibold text-gray-800 mb-2">
            10. Modifications to Terms
          </h2>
          <p className="text-gray-700 text-[19px] leading-7">
            WIZZ may update these Terms & Conditions at any time. Continued use
            of the platform indicates acceptance of the updated terms.
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

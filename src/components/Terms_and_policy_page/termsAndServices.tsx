import { useTheme } from "../../hooks/useTheme";

export default function TermsAndServicesPage() {
  const { bg, text, border, backDropFilter, lighterSwitch, isDark } =
    useTheme();

  return (
    <div className={`${bg} ${text} _bg-primaryTwo _text-white`}>
      <div className="containerA4">
        <h1 className="py-4 text-center text-2xl">PPTLinks Terms of Use</h1>
        <p className="py-2">Effective Date: January 2, 2025</p>
        <ol className="block w-full">
          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Introduction</h3>
            <p className="text-sm">
              Welcome to PPTLinks! We provide educational technology services
              designed to enhance learning experiences. By accessing or using
              our website, applications, or other services (collectively, the
              "Services"), you agree to comply with and be bound by these Terms
              of Service ("Terms"). Please read them carefully and contact us if
              you have any questions.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Eligibility</h3>
            <p className="text-sm">You may use our Services only if you:</p>
            <ul className="list-disc pl-8 text-sm">
              <li>Can form a binding contract with PPTLinks.</li>
              <li>Comply with these Terms and all applicable laws.</li>
              <li>
                Are over the age at which you can provide consent to data
                processing under the laws of your country.
              </li>
            </ul>
            <p className="text-sm mt-2">
              Use or access by anyone under the age of 13 is strictly
              prohibited.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">User Accounts</h3>
            <p className="text-sm">
              When creating an account with PPTLinks, you agree to:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>Provide accurate and complete information.</li>
              <li>Update your information to keep it accurate and complete.</li>
              <li>
                Maintain the security of your account by not sharing your
                password with others.
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account.
              </li>
            </ul>
            <p className="text-sm mt-2">
              You are responsible for all activities that occur under your
              account.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">License and Access</h3>
            <p className="text-sm">
              Subject to these Terms, PPTLinks grants you a limited, personal,
              non-exclusive, non-transferable, and revocable license to access
              and use our Services for personal, non-commercial purposes. Any
              commercial use requires a separate agreement with PPTLinks.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Content Offerings</h3>
            <p className="text-sm">
              PPTLinks may offer various courses and content ("Content
              Offerings") from educational providers ("Content Providers").
              While we strive to provide high-quality Content Offerings, we
              reserve the right to modify, reschedule, or discontinue any
              Content Offerings at our discretion.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Payments and Refunds
            </h3>
            <p className="text-sm">
              Certain aspects of our Services may require payment. You agree to
              the pricing and payment terms presented to you at the time of
              purchase. All payments are non-refundable unless otherwise stated.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Acceptable Use Policy
            </h3>
            <p className="text-sm">
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>Violating any applicable laws or regulations.</li>
              <li>Infringing the intellectual property rights of others.</li>
              <li>Transmitting any harmful or malicious code.</li>
              <li>
                Interfering with or disrupting the integrity or performance of
                our Services.
              </li>
            </ul>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Termination</h3>
            <p className="text-sm">
              PPTLinks reserves the right to suspend or terminate your access to
              our Services at our discretion, without notice, for conduct that
              we believe violates these Terms or is harmful to other users of
              our Services, us, or third parties, or for any other reason.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Disclaimers</h3>
            <p className="text-sm">
              Our Services and all content are provided on an "as is" basis
              without warranties of any kind, either express or implied.
              PPTLinks specifically disclaims any and all warranties and
              conditions of merchantability, fitness for a particular purpose,
              and non-infringement, and any warranties arising out of course of
              dealing or usage of trade.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Limitation of Liability
            </h3>
            <p className="text-sm">
              To the maximum extent permitted by law, PPTLinks shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses, resulting from (a) your use
              or inability to use the Services; (b) any unauthorized access to
              or use of our servers and/or any personal information stored
              therein.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Governing Law</h3>
            <p className="text-sm">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which PPTLinks operates, without
              regard to its conflict of law principles.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Changes to Terms</h3>
            <p className="text-sm">
              We may modify these Terms at any time. We will notify you of any
              changes by posting the new Terms on our website. You are advised
              to review these Terms periodically for any changes. Changes to
              these Terms are effective when they are posted on this page.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Contact Information</h3>
            <p className="text-sm">
              If you have any questions about these Terms, please contact us at
              support@pptlinks.com.
            </p>
          </li>
        </ol>
        <p className="py-4 text-sm">
          By using our Services, you acknowledge that you have read, understood,
          and agree to be bound by these Terms.
        </p>
      </div>
    </div>
  );
}

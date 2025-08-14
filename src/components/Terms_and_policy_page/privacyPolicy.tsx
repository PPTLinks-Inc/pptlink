import { useTheme } from "../../hooks/useTheme";

export default function PrivacyPolicyPage() {
  const { bg, text, border, backDropFilter, lighterSwitch, isDark } =
    useTheme();

  return (
    <div className={`${bg} ${text}  _bg-primaryTwo _text-white`}>
      <div className="containerA4">
        <h1 className="py-4 text-center text-2xl">PPTLinks Privacy Policy</h1>
        <p className="py-2">Effective Date: January 2, 2025</p>
        <ol className="block w-full">
          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Introduction</h3>
            <p className="text-sm">
              Welcome to PPTLinks! We are committed to protecting your privacy
              and ensuring the security of your personal information. This
              Privacy Policy outlines how we collect, use, and share information
              about you when you use our services. By accessing or using our
              services, you agree to the terms of this Privacy Policy.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Information We Collect
            </h3>
            <p className="text-sm">
              We collect information to provide and improve our services. The
              types of information we collect include:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>
                Personal Information: Information that identifies you
                personally, such as your name, email address, and contact
                details.
              </li>
              <li>
                Usage Data: Information about how you interact with our
                services, including your IP address, browser type, and pages
                visited.
              </li>
              <li>
                Cookies and Tracking Technologies: We use cookies to enhance
                your experience. You can manage your cookie preferences through
                your browser settings.
              </li>
            </ul>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              How We Use Your Information
            </h3>
            <p className="text-sm">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>Providing and maintaining our services.</li>
              <li>Improving and personalizing your experience.</li>
              <li>
                Communicating with you, including sending updates and
                promotional materials.
              </li>
              <li>Analyzing usage to enhance our services.</li>
              <li>Ensuring the security of our services.</li>
            </ul>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Sharing Your Information
            </h3>
            <p className="text-sm">
              We do not share your personal information with third parties
              except in the following circumstances:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>With your consent.</li>
              <li>To comply with legal obligations.</li>
              <li>To protect and defend our rights and property.</li>
              <li>
                With service providers who assist us in operating our services,
                subject to confidentiality agreements.
              </li>
            </ul>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Data Security</h3>
            <p className="text-sm">
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is completely secure.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Your Rights</h3>
            <p className="text-sm">
              Depending on your jurisdiction, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="list-disc pl-8 text-sm">
              <li>Accessing the personal information we hold about you.</li>
              <li>Requesting corrections to your personal information.</li>
              <li>Requesting the deletion of your personal information.</li>
              <li>Objecting to the processing of your personal information.</li>
              <li>
                Withdrawing consent where we rely on your consent to process
                your information.
              </li>
            </ul>
            <p className="text-sm mt-2">
              To exercise these rights, please contact us at
              privacy@pptlinks.com.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Children's Privacy</h3>
            <p className="text-sm">
              Our services are not intended for individuals under the age of 13.
              We do not knowingly collect personal information from children
              under 13. If we become aware that we have inadvertently collected
              such information, we will take steps to delete it.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">
              Changes to This Privacy Policy
            </h3>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on our
              website. You are advised to review this Privacy Policy
              periodically for any changes.
            </p>
          </li>

          <li className="block w-full py-2">
            <h3 className="text-xl font-bold uppercase">Contact Us</h3>
            <p className="text-sm">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at privacy@pptlinks.com.
            </p>
          </li>
        </ol>
        <p className="py-4 text-sm">
          By using our services, you acknowledge that you have read, understood,
          and agree to be bound by these Terms.
        </p>
      </div>
    </div>
  );
}
